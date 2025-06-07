'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import NoticeList from '@/components/features/notice/NoticeList'
import Pagination from '@/components/features/notice/Pagenation'
import { ZodType } from '@/shared/types'
import { NoticeEntitySchema } from '@/shared/schemas/notice'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import { NoticePageClientProps } from '@/types/notice'

const NoticeModal = dynamic(
	() => import('@/components/features/notice/CreateNoticeModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

const NoticeDetailModal = dynamic(
	() => import('@/components/features/notice/NoticeDetailModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

function NoticePageClientContent({
	isAdmin,
	initialPage = 1,
}: NoticePageClientProps) {
	const searchParams = useSearchParams()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedNotice, setSelectedNotice] = useState<ZodType<
		typeof NoticeEntitySchema
	> | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)

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
		error,
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
			refetchOnMount: false,
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

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const handleViewDetail = useCallback(
		(notice: ZodType<typeof NoticeEntitySchema>) => {
			setSelectedNotice(notice)
			setIsDetailOpen(true)
		},
		[],
	)

	const handleCloseDetail = useCallback(() => {
		setIsDetailOpen(false)
		setSelectedNotice(null)
	}, [])

	const showLoading = isLoading || isPageChanging || isFetching

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 공지사항 목록 스켈레톤 */}
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
							</div>
							{isAdmin && (
								<div className="flex gap-2">
									<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
									<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
								</div>
							)}
						</div>
						<div className="space-y-2 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
							<div className="flex items-center">
								<div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
							</div>
							<div className="flex items-center">
								<div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
							</div>
						</div>
					</div>
				))}

				{/* 페이지네이션 스켈레톤 */}
				<div className="flex items-center justify-center space-x-2 mt-8">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
					<div className="hidden sm:flex space-x-1">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
							/>
						))}
					</div>
					<div className="sm:hidden w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
					<span className="text-2xl text-white" role="img" aria-label="오류">
						⚠️
					</span>
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					공지사항을 불러올 수 없습니다
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-4">
					{error?.message || '네트워크 오류가 발생했습니다.'}
				</p>
				<Button
					onClick={() => refetch()}
					className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
				>
					다시 시도
				</Button>
			</div>
		)
	}

	return (
		<>
			{/* 공지사항 목록 */}
			<NoticeList notices={notices} onViewDetail={handleViewDetail} />

			{/* 페이지네이션 */}
			{notices.length > 0 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/notice"
					/>
				</div>
			)}

			{/* 추가 정보 섹션 */}
			{notices.length > 0 && (
				<div className="mt-12 sm:mt-16">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-gray-600 text-center">
						<div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
							💡 알림 설정
						</div>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
							새로운 공지사항이 등록되면 이메일이나 카카오톡으로 알림을 받고
							싶으시다면,
							<br className="hidden sm:block" />
							관리자에게 문의해주세요.
						</p>
					</div>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{notices.length === 0 && (
				<div className="text-center py-12">
					<div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<span
							className="text-2xl text-white"
							role="img"
							aria-label="빈 상태"
						>
							📭
						</span>
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

			{/* 오른쪽 하단 플로팅 +버튼 (관리자만) */}
			{isAdmin && !isDetailOpen && (
				<button
					onClick={handleOpenModal}
					aria-label="공지사항 작성"
					className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
				>
					<span className="text-3xl">+</span>
				</button>
			)}

			{/* 동적으로 로드되는 모달들 */}
			<NoticeModal open={isModalOpen} onClose={handleCloseModal} />
			<NoticeDetailModal
				open={isDetailOpen}
				onClose={handleCloseDetail}
				notice={selectedNotice}
			/>
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
