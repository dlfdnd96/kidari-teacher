'use client'

import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import { keepPreviousData } from '@tanstack/react-query'
import { NoticePageClientProps } from '@/types/notice'
import { Plus, RefreshCw } from 'lucide-react'
import { NoticeList, NoticeSkeletonList } from './components'
import { ErrorState } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import Pagination from '@/components/features/pagination/Pagination'
import { Enum } from '@/enums'
import { useSession } from 'next-auth/react'

function NoticePageClientContent({ initialPage = 1 }: NoticePageClientProps) {
	const searchParams = useSearchParams()
	const { data: session } = useSession()
	const { getNoticeListQuery, navigateToCreate } = useNoticeActions()

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const pageSize = 10
	const isAdmin = session?.user?.role === Enum.Role.ADMIN

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
	} = getNoticeListQuery(
		{
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
		navigateToCreate()
	}, [navigateToCreate])

	const showLoading = isLoading || isPageChanging || isFetching

	const loadingIndicator = useMemo(
		() =>
			isFetching && (
				<div
					className="flex justify-center mb-4"
					role="status"
					aria-live="polite"
				>
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
						<RefreshCw
							className="w-4 h-4 text-emerald-600 animate-spin"
							aria-hidden="true"
						/>
						<span className="text-sm text-emerald-600 dark:text-emerald-400">
							불러오는 중...
						</span>
					</div>
				</div>
			),
		[isFetching],
	)

	if (showLoading) {
		return (
			<NoticeSkeletonList
				count={3}
				showHeader={isAdmin}
				showPagination={false}
			/>
		)
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
		<main role="main" aria-label="공지사항 목록">
			{/* 헤더 영역 - 생성 버튼 */}
			<header className="mb-8">
				{isAdmin && (
					<div className="flex justify-end mb-4">
						<Button
							onClick={handleCreateNotice}
							variant="outline"
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
							data-cy="create-notice-button"
							aria-label="새 공지사항 작성"
						>
							<Plus className="w-4 h-4" aria-hidden="true" />
							<span>공지사항 작성</span>
						</Button>
					</div>
				)}
			</header>

			{/* 로딩 인디케이터 */}
			{loadingIndicator}

			{/* 공지사항 목록 */}
			<NoticeList notices={notices} />

			{/* 페이지네이션 */}
			{notices.length > 0 && totalPages > 1 && (
				<nav className="mt-8 sm:mt-12" aria-label="공지사항 페이지네이션">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/notice"
					/>
				</nav>
			)}

			{/* 스크린 리더용 현재 상태 정보 */}
			<div className="sr-only" aria-live="polite">
				{notices.length > 0
					? `${totalCount}개의 공지사항 중 ${(currentPage - 1) * pageSize + 1}번째부터 ${Math.min(currentPage * pageSize, totalCount)}번째까지 표시 중입니다.`
					: '등록된 공지사항이 없습니다.'}
			</div>
		</main>
	)
}

export default function NoticePageClient({
	initialPage,
}: NoticePageClientProps) {
	return (
		<Suspense fallback={<NoticeSkeletonList />}>
			<NoticePageClientContent initialPage={initialPage} />
		</Suspense>
	)
}
