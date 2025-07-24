'use client'

import React, { memo, useCallback, useEffect, useState } from 'react'
import {
	AlertCircle,
	AlertTriangle,
	Calendar,
	Edit,
	MoreHorizontal,
	Trash,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import {
	NoticeDeleteDialogProps,
	NoticeDetailContentProps,
	NoticeDetailHeaderProps,
	NoticeDetailPageClientProps,
	NoticePageLayoutProps,
} from '@/types/notice'
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'
import { LoadingSpinner } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import { Enum } from '@/enums'
import { useSession } from 'next-auth/react'

const NoticePageLayout = memo(
	({ children, className = '' }: NoticePageLayoutProps) => (
		<div className={`min-h-screen ${className}`}>
			{/* 메인 컨텐츠 */}
			<main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">{children}</main>
		</div>
	),
)

NoticePageLayout.displayName = 'NoticePageLayout'

const NoticeDetailHeader = memo(
	({
		notice,
		onEdit,
		onDelete,
		isAdmin,
	}: NoticeDetailHeaderProps & {
		onEdit?: () => void
		onDelete?: () => void
		isAdmin?: boolean
	}) => (
		<header className="mb-8">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
						{notice.title}
					</h1>
					<div className="flex items-center justify-between">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
							<div className="flex items-center">
								<span className="text-sm font-medium">작성자:</span>
								<span className="text-sm font-medium ml-1">
									{notice.author?.name || '관리자'}
								</span>
							</div>
							<div className="flex items-center">
								<Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
								<time
									className="text-sm"
									dateTime={notice.createdAt.toISOString()}
								>
									{format(notice.createdAt, 'yyyy년 MM월 dd일', {
										locale: ko,
									})}
								</time>
							</div>
						</div>
						{/* 더보기 메뉴 */}
						{isAdmin && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
										aria-label="더보기 옵션"
									>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={onEdit}
										className="cursor-pointer"
										aria-label="공지사항 수정"
									>
										<Edit className="w-4 h-4 mr-2" aria-hidden="true" />
										수정하기
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={onDelete}
										className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
										aria-label="공지사항 삭제"
									>
										<Trash className="w-4 h-4 mr-2" aria-hidden="true" />
										삭제하기
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>
			<div
				className="border-b border-gray-200 dark:border-gray-700"
				aria-hidden="true"
			/>
		</header>
	),
)

NoticeDetailHeader.displayName = 'NoticeDetailHeader'

const NoticeDetailContent = memo(({ content }: NoticeDetailContentProps) => (
	<section className="space-y-8">
		<div className="prose prose-gray dark:prose-invert max-w-none">
			<div
				className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-base"
				role="article"
				aria-label="공지사항 내용"
			>
				{content}
			</div>
		</div>
	</section>
))

NoticeDetailContent.displayName = 'NoticeDetailContent'

const NoticeDeleteDialog = memo(
	({
		open,
		onOpenChange,
		onConfirm,
		isLoading = false,
	}: NoticeDeleteDialogProps) => (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
						<AlertTriangle className="w-6 h-6" aria-hidden="true" />
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
									<AlertCircle
										className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0"
										aria-hidden="true"
									/>
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
						className="cursor-pointer"
						data-cy="cancel-delete-notice-button"
						disabled={isLoading}
					>
						취소
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
						data-cy="delete-notice-button"
					>
						{isLoading ? '삭제 중...' : '삭제'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
)

NoticeDeleteDialog.displayName = 'NoticeDeleteDialog'

export default function NoticeDetailPageClient({
	id,
}: NoticeDetailPageClientProps) {
	const { showError } = useErrorModal()
	const { data: session } = useSession()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const {
		getNoticeQuery,
		deleteNoticeMutation,
		navigateToEdit,
		navigateToList,
		checkAuthentication,
	} = useNoticeActions()

	const isAdmin = session?.user?.role === Enum.Role.ADMIN
	const { data: notice, isLoading, isError } = getNoticeQuery({ id })

	const handleDeleteConfirm = useCallback(async () => {
		if (!checkAuthentication() || !notice) {
			return
		}

		try {
			await deleteNoticeMutation.mutateAsync({ id: notice.id })
		} catch (error) {
			handleClientError(error, showError, '공지사항 삭제 오류')
		}
	}, [checkAuthentication, notice, deleteNoticeMutation, showError])

	const handleDeleteClick = useCallback(() => {
		setIsDeleteDialogOpen(true)
	}, [])

	const handleEdit = useCallback(() => {
		navigateToEdit(id)
	}, [navigateToEdit, id])

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
		<>
			<NoticePageLayout>
				<div className="py-8">
					<NoticeDetailHeader
						notice={notice}
						onEdit={handleEdit}
						onDelete={handleDeleteClick}
						isAdmin={isAdmin}
					/>
					<NoticeDetailContent content={notice.content} />
				</div>
			</NoticePageLayout>

			<NoticeDeleteDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={deleteNoticeMutation.isPending}
			/>
		</>
	)
}
