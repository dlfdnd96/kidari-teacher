'use client'

import React, { memo, useCallback, useState } from 'react'
import NoticeEditForm from '@/components/features/notice/NoticeEditForm'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ZodType } from '@/shared/types'
import { NoticeEntitySchema } from '@/app/api/notice/schema'
import { Enum } from '@/enums'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'

export interface NoticeCardProps {
	notice: ZodType<typeof NoticeEntitySchema>
	onViewDetail?: (notice: ZodType<typeof NoticeEntitySchema>) => void
}

const NoticeCard = memo(({ notice, onViewDetail }: NoticeCardProps) => {
	const { data: session } = useSession()
	const isAdmin = session?.user.role === Enum.Role.ADMIN
	const [editing, setEditing] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const router = useRouter()
	const { showError } = useErrorModal()

	const handleDelete = useCallback(async () => {
		setDeleting(true)
		try {
			const res = await fetch(`/api/notice/${notice.id}`, { method: 'DELETE' })
			const result = await res.json()
			if (!res.ok) {
				throw new Error(result.error || '삭제를 실패했습니다.')
			}

			router.refresh()
		} catch (e: any) {
			showError(e.message, '공지사항 삭제 오류')
		} finally {
			setDeleting(false)
			setShowDeleteConfirm(false)
		}
	}, [notice.id, router, showError])

	const handleViewDetail = useCallback(() => {
		onViewDetail?.(notice)
	}, [notice, onViewDetail])

	const handleEdit = useCallback(() => {
		setEditing(true)
	}, [])

	const handleCancelEdit = useCallback(() => {
		setEditing(false)
	}, [])

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			if (showDeleteConfirm) {
				setShowDeleteConfirm(false)
				e.stopPropagation()
				return
			}
			handleViewDetail()
		},
		[showDeleteConfirm, handleViewDetail],
	)

	if (editing) {
		return (
			<NoticeEditForm
				id={notice.id}
				initialTitle={notice.title}
				initialContent={notice.content}
				onCancel={handleCancelEdit}
			/>
		)
	}

	return (
		<>
			<div
				className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mb-4 sm:mb-6 cursor-pointer"
				onClick={handleCardClick}
			>
				{/* 헤더 */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center flex-1 min-w-0 mr-4">
						<h3
							className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
							title={notice.title}
						>
							{notice.title}
						</h3>
					</div>

					{isAdmin && (
						<div className="flex gap-2 flex-shrink-0">
							<button
								className="px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
								onClick={(e) => {
									e.stopPropagation()
									handleEdit()
								}}
								type="button"
								aria-label="공지사항 수정"
							>
								✏️ 수정
							</button>

							{!showDeleteConfirm ? (
								<button
									className="px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-full hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/30 dark:hover:to-pink-800/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50"
									onClick={(e) => {
										e.stopPropagation()
										setShowDeleteConfirm(true)
									}}
									type="button"
									aria-label="공지사항 삭제"
								>
									🗑️ 삭제
								</button>
							) : (
								<div className="flex gap-1">
									<button
										className="px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50"
										onClick={(e) => {
											e.stopPropagation()
											setShowDeleteConfirm(false)
										}}
										disabled={deleting}
										type="button"
										aria-label="삭제 취소"
									>
										❌ 취소
									</button>
									<button
										className="px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
										onClick={(e) => {
											e.stopPropagation()
											handleDelete()
										}}
										disabled={deleting}
										type="button"
										aria-label="삭제 확인"
									>
										{deleting ? (
											<>
												<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1 inline-block" />
												삭제중...
											</>
										) : (
											<>🗑️ 확인</>
										)}
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* 내용 */}
				<div className="mb-4">
					<p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
						{notice.content}
					</p>
					{notice.content.length > 100 && (
						<div className="mt-2">
							<span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
								클릭하여 전체 내용 보기 →
							</span>
						</div>
					)}
				</div>

				{/* 푸터 */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
					<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
						<div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-2">
							<span
								className="text-white text-xs"
								role="img"
								aria-label="작성자"
							>
								👤
							</span>
						</div>
						<span className="font-medium">
							{notice.author?.name ?? '관리자'}
						</span>
					</div>

					<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
						<div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-2">
							<span
								className="text-white text-xs"
								role="img"
								aria-label="작성일"
							>
								📅
							</span>
						</div>
						<time dateTime={notice.createdAt}>
							{new Date(notice.createdAt).toLocaleDateString('ko-KR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</time>
					</div>
				</div>

				{/* 액센트 라인 */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>
		</>
	)
})

NoticeCard.displayName = 'NoticeCard'

export default NoticeCard
