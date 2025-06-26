'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import MyApplicationList from '@/components/features/applications/MyApplicationList'
import Pagination from '@/components/features/pagination/Pagination'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import type { MyApplicationPageClientProps } from '@/types/application'
import { FileText, OctagonX, RefreshCw } from 'lucide-react'

function MyApplicationPageClientContent({
	initialPage = 1,
}: MyApplicationPageClientProps) {
	const searchParams = useSearchParams()

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)

	const pageSize = 20

	useEffect(() => {
		const pageFromUrl = parseInt(searchParams?.get('page') || '1', 10)

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

	const showLoading = isLoading || isPageChanging

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 헤더 스켈레톤 */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
					</div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
				</div>

				{/* 테이블 스켈레톤 */}
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
			{/* 헤더 */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="w-5 h-5 text-blue-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							신청 현황
						</h3>
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						총 <span className="font-medium text-blue-600">{totalCount}</span>개
					</div>
				</div>
			</div>

			{/* 로딩 인디케이터 */}
			{isFetching && (
				<div className="flex justify-center mb-4">
					<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
						<RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
						<span className="text-sm text-blue-600 dark:text-blue-400">
							로딩 중...
						</span>
					</div>
				</div>
			)}

			{/* 신청 목록 테이블 */}
			<MyApplicationList applications={applications} isLoading={false} />

			{/* 페이지네이션 */}
			{applications.length > 0 && totalPages > 1 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/my-applications"
						extraParams={{}}
					/>
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
