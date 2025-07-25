'use client'

import React, { memo, useCallback } from 'react'
import { useNoticeActions } from './hooks'
import { NoticeForm } from '@/components/features/notice/components'
import { ZodType } from '@/shared/types'
import { NoticeFormSchema } from '@/shared/schemas/notice'
import { useToast } from '@/contexts/ToastContext'
import { LoadingSpinner } from '@/components/common/ui'
import { NoticePageLayoutProps } from '@/types/notice'

const NoticePageLayout = memo(
	({ children, className = '' }: NoticePageLayoutProps) => (
		<div className={`min-h-screen ${className}`}>
			{/* 메인 컨텐츠 */}
			<main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">{children}</main>
		</div>
	),
)

NoticePageLayout.displayName = 'NoticePageLayout'

const NoticeCreatePageClient = memo(() => {
	const { showSuccess } = useToast()

	const { createNoticeMutation, navigateToList, goBack, checkAuthentication } =
		useNoticeActions()

	const handleSubmit = useCallback(
		async (data: ZodType<typeof NoticeFormSchema>) => {
			if (!checkAuthentication()) {
				return
			}

			await createNoticeMutation.mutateAsync(data)
			showSuccess('공지사항이 생성되었습니다')
		},
		[createNoticeMutation, checkAuthentication, showSuccess],
	)

	const handleCancel = useCallback(() => {
		goBack()
	}, [goBack])

	const handleSuccess = useCallback(() => {
		navigateToList()
	}, [navigateToList])

	if (createNoticeMutation.isPending) {
		return (
			<NoticePageLayout>
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner size="lg" />
				</div>
			</NoticePageLayout>
		)
	}

	return (
		<NoticePageLayout>
			<div className="py-8">
				<NoticeForm
					onSubmit={handleSubmit}
					onSuccess={handleSuccess}
					onCancel={handleCancel}
				/>
			</div>
		</NoticePageLayout>
	)
})

NoticeCreatePageClient.displayName = 'NoticeCreatePageClient'

export default NoticeCreatePageClient
