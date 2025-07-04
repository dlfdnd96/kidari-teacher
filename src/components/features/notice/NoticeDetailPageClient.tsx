'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { trpc } from '@/components/providers/TrpcProvider'
import { Edit, Trash, AlertTriangle, AlertCircle, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import { NoticeDetailPageClientProps } from '@/types/notice'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
} from '@/components/ui'
import { BackButton, LoadingSpinner } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import { Enum } from '@/enums'
import { useSession } from 'next-auth/react'

export default function NoticeDetailPageClient({
	noticeId,
}: NoticeDetailPageClientProps) {
	const { showError } = useErrorModal()
	const { data: session } = useSession()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const {
		deleteNoticeMutation,
		navigateToEdit,
		navigateToList,
		checkAuthentication,
	} = useNoticeActions()
	const isAdmin = session?.user?.role === Enum.Role.ADMIN

	const {
		data: notice,
		isLoading,
		isError,
	} = trpc.notice.getNotice.useQuery({ id: noticeId })

	const handleDeleteConfirm = useCallback(async () => {
		if (!checkAuthentication() || !notice) return

		try {
			await deleteNoticeMutation.mutateAsync({ id: notice.id })
		} catch (error) {
			handleClientError(error, showError, '공지사항 삭제 오류')
		}
	}, [checkAuthentication, notice, deleteNoticeMutation, showError])

	const handleDeleteCancel = useCallback(() => {
		setIsDeleteDialogOpen(false)
	}, [])

	const handleDeleteClick = useCallback(() => {
		setIsDeleteDialogOpen(true)
	}, [])

	const handleEdit = useCallback(() => {
		navigateToEdit(noticeId)
	}, [navigateToEdit, noticeId])

	const handleBack = useCallback(() => {
		navigateToList()
	}, [navigateToList])

	useEffect(() => {
		if (!isLoading && (isError || !notice)) {
			handleClientError(
				CLIENT_ERROR_KEY_MAPPING.NOT_FOUND_ERROR,
				showError,
				'공지사항 불러오기 오류',
			)
			navigateToList()
		}
	}, [isError, notice, navigateToList, showError, isLoading])

	const adminActions = useMemo(
		() =>
			isAdmin && (
				<div className="py-4 flex items-center gap-2">
					<Button
						onClick={handleEdit}
						variant="outline"
						className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
					>
						<Edit className="w-4 h-4" />
						<span>수정</span>
					</Button>
					<Button
						onClick={handleDeleteClick}
						variant="outline"
						className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
					>
						<Trash className="w-4 h-4" />
						<span>삭제</span>
					</Button>
				</div>
			),
		[isAdmin, handleEdit, handleDeleteClick],
	)

	const noticeHeader = useMemo(
		() =>
			notice && (
				<div className="mb-8">
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
								{notice.title}
							</h1>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
								<div className="flex items-center">
									<span className="text-sm font-medium">작성자:</span>
									<span className="text-sm font-medium ml-1">
										{notice.author?.name || '관리자'}
									</span>
								</div>
								<div className="flex items-center">
									<Calendar className="w-4 h-4 mr-2" />
									<time className="text-sm">
										{format(notice.createdAt, 'yyyy년 MM월 dd일', {
											locale: ko,
										})}
									</time>
								</div>
							</div>
						</div>
					</div>
					<div className="border-b border-gray-200 dark:border-gray-700"></div>
				</div>
			),
		[notice],
	)

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	if (!notice) {
		return null
	}

	return (
		<div className="min-h-screen">
			{/* 상단 네비게이션 */}
			<div>
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
					<div className="flex items-center justify-between h-14">
						<div className="py-4">
							<BackButton onClick={handleBack} />
						</div>

						{/* 수정/삭제 버튼 */}
						{adminActions}
					</div>
				</div>
			</div>

			{/* 메인 컨텐츠 */}
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
				<div className="p-6 sm:p-8">
					{/* 헤더 */}
					{noticeHeader}

					{/* 내용 */}
					<div className="space-y-8">
						<div className="prose prose-gray dark:prose-invert max-w-none">
							<div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-base">
								{notice.content}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 삭제 확인 모달 */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
							<AlertTriangle className="w-6 h-6" />
							공지사항 삭제
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-4">
								{/* 메인 질문 */}
								<div className="text-gray-900 dark:text-gray-100 font-medium text-base">
									공지사항을 삭제하시겠습니까?
								</div>

								{/* 경고 메시지 */}
								<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
									<div className="flex items-center gap-2">
										<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
										<span className="text-red-800 dark:text-red-200 font-semibold text-sm">
											이 작업은 되돌릴 수 없습니다.
										</span>
									</div>
								</div>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={handleDeleteCancel}
							className={'cursor-pointer'}
							data-cy="cancel-delete-notice-button"
						>
							취소
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={deleteNoticeMutation.isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
							data-cy="delete-notice-button"
						>
							{deleteNoticeMutation.isPending ? '삭제 중...' : '삭제'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
