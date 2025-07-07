'use client'

import React, { memo, useCallback } from 'react'
import { useNoticeActions } from './hooks'
import { NoticeForm } from '@/components/features/notice/components'
import { ZodType } from '@/shared/types'
import { NoticeFormSchema } from '@/shared/schemas/notice'
import { useToast } from '@/contexts/ToastContext'

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

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
				<NoticeForm
					onSubmit={handleSubmit}
					onSuccess={navigateToList}
					onCancel={goBack}
				/>
			</div>
		</div>
	)
})

NoticeCreatePageClient.displayName = 'NoticeCreatePageClient'

export default NoticeCreatePageClient
