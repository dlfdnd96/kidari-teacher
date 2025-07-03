'use client'

import React, {
	Suspense,
	useCallback,
	useEffect,
	useState,
	useMemo,
} from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui'
import { keepPreviousData } from '@tanstack/react-query'
import { NoticePageClientProps } from '@/types/notice'
import { CircleAlert, Plus, RefreshCw } from 'lucide-react'
import { NoticeSkeletonList } from './components'
import { ErrorState } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import NoticeList from './NoticeList'
import Pagination from '@/components/features/pagination/Pagination'

function NoticePageClientContent({
	isAdmin,
	initialPage = 1,
}: NoticePageClientProps) {
	const searchParams = useSearchParams()
	const { navigateToCreate } = useNoticeActions()

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

	const queryOptions = useMemo(
		() => ({
			filter: {
				isPublished: true,
			},
			pageable: {
				offset: (currentPage - 1) * pageSize,
				limit: pageSize,
				sort: {
					createdAt: 'desc' as const,
				},
			},
		}),
		[currentPage, pageSize],
	)

	const {
		data: noticeData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.notice.getNoticeList.useQuery(queryOptions, {
		staleTime: 60 * 1000,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	})

	const notices = noticeData?.noticeList || []
	const totalCount = noticeData?.totalCount || notices.length
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const handleCreateNotice = useCallback(() => {
		navigateToCreate()
	}, [navigateToCreate])

	const showLoading = isLoading || isPageChanging || isFetching

	const emptyState = useMemo(
		() => (
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
		),
		[isAdmin],
	)

	const loadingIndicator = useMemo(
		() =>
			isFetching && (
				<div className="flex justify-center mb-4">
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
						<RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
						<span className="text-sm text-emerald-600 dark:text-emerald-400">
							불러오는 중...
						</span>
					</div>
				</div>
			),
		[isFetching],
	)

	if (showLoading) {
		return <NoticeSkeletonList showHeader={isAdmin} />
	}

	if (isError) {
		return (
			<ErrorState
				title="공지사항을 불러올 수 없습니다"
				message="잠시 후 다시 시도해주세요."
				onRetry={refetch}
			/>
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
							data-cy="create-notice-button"
						>
							<Plus className="w-4 h-4" />
							<span>공지사항 작성</span>
						</Button>
					</div>
				)}
			</div>

			{/* 로딩 인디케이터 */}
			{loadingIndicator}

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
			{notices.length === 0 && emptyState}
		</>
	)
}

export default function NoticePageClient({
	isAdmin,
	initialPage,
}: NoticePageClientProps) {
	return (
		<Suspense fallback={<NoticeSkeletonList />}>
			<NoticePageClientContent isAdmin={isAdmin} initialPage={initialPage} />
		</Suspense>
	)
}
