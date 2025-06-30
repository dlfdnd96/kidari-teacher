'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useSearchParams, useRouter } from 'next/navigation'
import NoticeList from '@/components/features/notice/NoticeList'
import Pagination from '@/components/features/pagination/Pagination'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui'
import { keepPreviousData } from '@tanstack/react-query'
import { NoticePageClientProps } from '@/types/notice'
import { CircleAlert, OctagonX, Plus, RefreshCw } from 'lucide-react'

function NoticePageClientContent({
	isAdmin,
	initialPage = 1,
}: NoticePageClientProps) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const pageSize = 10

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
	}, [searchParams, currentPage])

	const {
		data: noticeData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.notice.getNoticeList.useQuery(
		{
			filter: {
				isPublished: true,
			},
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

	const notices = noticeData?.noticeList || []
	const totalCount = noticeData?.totalCount || notices.length
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const handleCreateNotice = useCallback(() => {
		router.push('/notice/create')
	}, [router])

	const showLoading = isLoading || isPageChanging || isFetching

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 헤더 스켈레톤 */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
						</div>
					</div>

					{/* 생성 버튼 스켈레톤 */}
					{isAdmin && (
						<div className="flex justify-end">
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse" />
						</div>
					)}
				</div>

				{/* 공지사항 목록 스켈레톤 */}
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 animate-pulse"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
								<div className="flex gap-4">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
								</div>
							</div>
						</div>
						<div className="pt-3 border-t border-gray-200 dark:border-gray-600">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
						</div>
					</div>
				))}

				{/* 페이지네이션 스켈레톤 */}
				<div className="flex items-center justify-center space-x-2">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="hidden sm:flex space-x-1">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
							/>
						))}
					</div>
					<div className="sm:hidden w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				</div>
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
					공지사항을 불러올 수 없습니다
				</h3>
				<div className="flex justify-center">
					<Button
						onClick={() => refetch()}
						className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
			{/* 헤더 영역 - 생성 버튼 */}
			<div className="mb-8">
				{/* 우측 상단 생성 버튼 */}
				{isAdmin && (
					<div className="flex justify-end mb-4">
						<Button
							onClick={handleCreateNotice}
							variant="outline"
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
							data-testid="create-notice-button"
						>
							<Plus className="w-4 h-4" />
							<span>공지사항 작성</span>
						</Button>
					</div>
				)}
			</div>

			{/* 로딩 인디케이터 (검색 중일 때만 작은 표시) */}
			{isFetching && (
				<div className="flex justify-center mb-4">
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
						<RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
						<span className="text-sm text-emerald-600 dark:text-emerald-400">
							불러오는 중...
						</span>
					</div>
				</div>
			)}

			{/* 공지사항 목록 */}
			<NoticeList notices={notices} />

			{/* 페이지네이션 */}
			{notices.length > 0 && totalPages > 1 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/notice"
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{notices.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						아직 등록된 공지사항이 없습니다
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{isAdmin
							? '첫 번째 공지사항을 작성해보세요!'
							: '새로운 공지사항을 기다려주세요.'}
					</p>
				</div>
			)}
		</>
	)
}

export default function NoticePageClient({
	isAdmin,
	initialPage,
}: NoticePageClientProps) {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<NoticePageClientContent isAdmin={isAdmin} initialPage={initialPage} />
		</Suspense>
	)
}
