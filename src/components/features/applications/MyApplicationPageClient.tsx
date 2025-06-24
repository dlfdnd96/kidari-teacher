'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import MyApplicationList from '@/components/features/applications/MyApplicationList'
import MyApplicationFilterTab from '@/components/features/applications/MyApplicationFilterTab'
import Pagination from '@/components/features/pagination/Pagination'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import type { MyApplicationPageClientProps } from '@/types/application'
import { CircleAlert, OctagonX, RefreshCw } from 'lucide-react'

function MyApplicationPageClientContent({
	initialPage = 1,
}: MyApplicationPageClientProps) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all')

	const urlUpdateTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
	const pageSize = 10

	useEffect(() => {
		const statusFromUrl = searchParams?.get('status') || 'all'
		const pageFromUrl = parseInt(searchParams?.get('page') || '1', 10)

		setSelectedStatus(statusFromUrl)

		if (pageFromUrl !== currentPage) {
			setIsPageChanging(true)
			setCurrentPage(pageFromUrl)

			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
				setIsPageChanging(false)
			}, 150)
		}
	}, [currentPage, searchParams])

	const {
		data: applicationData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.application.getMyApplicationList.useQuery(
		{
			pageable: {
				offset: (currentPage - 1) * pageSize,
				limit: pageSize,
				sort: {
					createdAt: 'desc',
				},
			},
			filter: {
				...(selectedStatus !== 'all' && { status: selectedStatus }),
			},
		},
		{
			staleTime: 60 * 1000,
			refetchOnWindowFocus: false,
			placeholderData: keepPreviousData,
		},
	)

	const applications = React.useMemo(() => {
		if (!applicationData?.myApplicationList) {
			return []
		}
		return applicationData.myApplicationList
	}, [applicationData])

	const totalCount = applicationData?.totalCount || 0
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const updateURL = useCallback(
		(params: { status?: string; page?: number }) => {
			if (urlUpdateTimeoutRef.current) {
				clearTimeout(urlUpdateTimeoutRef.current)
			}

			urlUpdateTimeoutRef.current = setTimeout(() => {
				const urlParams = new URLSearchParams()

				if (params.status && params.status !== 'all') {
					urlParams.set('status', params.status)
				}
				if (params.page && params.page > 1) {
					urlParams.set('page', params.page.toString())
				}

				const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : ''

				router.replace(`/my-applications${newUrl}`, { scroll: false })
			}, 0)
		},
		[router],
	)

	const handleStatusChange = useCallback(
		(status: string | 'all') => {
			setSelectedStatus(status)
			setCurrentPage(1)
			updateURL({
				status: status,
				page: 1,
			})
		},
		[updateURL],
	)

	useEffect(() => {
		return () => {
			if (urlUpdateTimeoutRef.current) {
				clearTimeout(urlUpdateTimeoutRef.current)
			}
		}
	}, [])

	const showLoading = isLoading || isPageChanging

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 필터 스켈레톤 */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
						</div>
					</div>

					{/* 필터 드롭다운 스켈레톤 */}
					<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse" />

					{/* 필터 설명 스켈레톤 */}
					<div className="space-y-3">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
					</div>
				</div>

				{/* 신청 목록 스켈레톤 */}
				<MyApplicationList applications={[]} isLoading={true} />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<OctagonX className="w-16 h-16 text-red-400 dark:text-red-500" />
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					신청 내역을 불러올 수 없습니다
				</h3>
				<div className="flex justify-center">
					<Button
						onClick={() => refetch()}
						className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					>
						<RefreshCw className="w-4 h-4 mr-1.5" />
						<span>다시 시도</span>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			{/* 필터 */}
			<div className="mb-8">
				<MyApplicationFilterTab
					selectedStatus={selectedStatus}
					statusChangeAction={handleStatusChange}
					allStatusCount={totalCount}
				/>
			</div>

			{/* 로딩 인디케이터 (필터링 중일 때만 작은 표시) */}
			{isFetching && (
				<div className="flex justify-center mb-4">
					<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
						<RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
						<span className="text-sm text-blue-600 dark:text-blue-400">
							필터링 중...
						</span>
					</div>
				</div>
			)}

			{/* 신청 목록 */}
			<MyApplicationList applications={applications} isLoading={false} />

			{/* 페이지네이션 */}
			{applications.length > 0 && totalPages > 1 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/my-applications"
						extraParams={{
							...(selectedStatus !== 'all' && { status: selectedStatus }),
						}}
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{applications.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{selectedStatus === 'all'
							? '아직 신청한 봉사활동이 없습니다'
							: '해당 상태의 신청이 없습니다'}
					</h3>
					<p className="text-gray-500 dark:text-gray-400 mb-6">
						{selectedStatus === 'all'
							? '관심있는 봉사활동에 신청해보세요!'
							: '다른 상태의 신청을 확인하거나 새로운 봉사활동에 신청해보세요.'}
					</p>
					<Button
						onClick={() => (window.location.href = '/volunteer-activities')}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					>
						봉사활동 둘러보기
					</Button>
				</div>
			)}
		</>
	)
}

export default function MyApplicationPageClient({
	initialPage,
}: MyApplicationPageClientProps) {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<MyApplicationPageClientContent initialPage={initialPage} />
		</Suspense>
	)
}
