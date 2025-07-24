'use client'

import React, { memo, useCallback } from 'react'
import {
	NoticeEditPageClientProps,
	NoticePageLayoutProps,
} from '@/types/notice'
import { ErrorState, LoadingSpinner } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import { NoticeForm } from './components'
import { ZodType } from '@/shared/types'
import { NoticeFormSchema } from '@/shared/schemas/notice'

const NoticePageLayout = memo(
	({ children, className = '' }: NoticePageLayoutProps) => (
		<div className={`min-h-screen ${className}`}>
			{/* 메인 컨텐츠 */}
			<main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">{children}</main>
		</div>
	),
)

NoticePageLayout.displayName = 'NoticePageLayout'

const NoticeEditPageClient = memo(({ id }: NoticeEditPageClientProps) => {
	const {
		getNoticeQuery,
		checkAuthentication,
		updateNoticeMutation,
		navigateToList,
		navigateToDetail,
	} = useNoticeActions()

	const { data: notice, isLoading, isError } = getNoticeQuery({ id })

	const handleSubmit = useCallback(
		async (data: ZodType<typeof NoticeFormSchema>) => {
			if (!checkAuthentication()) {
				return
			}

			await updateNoticeMutation.mutateAsync({
				id,
				title: data.title,
				content: data.content,
			})
		},
		[checkAuthentication, updateNoticeMutation, id],
	)

	const handleCancel = useCallback(() => {
		navigateToDetail(id)
	}, [navigateToDetail, id])

	const handleSuccess = useCallback(() => {
		navigateToDetail(id)
	}, [navigateToDetail, id])

	const handleBackToList = useCallback(() => {
		navigateToList()
	}, [navigateToList])

	if (isLoading) {
		return (
			<NoticePageLayout>
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner size="lg" />
				</div>
			</NoticePageLayout>
		)
	}

	if (isError || !notice) {
		return (
			<NoticePageLayout>
				<div className="py-8">
					<ErrorState
						title="공지사항을 찾을 수 없습니다"
						message="요청하신 공지사항이 존재하지 않거나 삭제되었습니다."
						onRetry={handleBackToList}
					/>
				</div>
			</NoticePageLayout>
		)
	}

	return (
		<NoticePageLayout>
			<div className="py-8">
				<NoticeForm
					notice={notice}
					onSubmit={handleSubmit}
					onSuccess={handleSuccess}
					onCancel={handleCancel}
				/>
			</div>
		</NoticePageLayout>
	)
})

NoticeEditPageClient.displayName = 'NoticeEditPageClient'

export default NoticeEditPageClient
