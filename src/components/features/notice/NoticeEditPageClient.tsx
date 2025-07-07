'use client'

import React, { memo, useCallback } from 'react'
import { NoticeEditPageClientProps } from '@/types/notice'
import { BackButton, LoadingSpinner, ErrorState } from '@/components/common/ui'
import { useNoticeActions } from './hooks'
import { NoticeForm } from './components'
import { ZodType } from '@/shared/types'
import { NoticeFormSchema } from '@/shared/schemas/notice'

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

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	if (isError || !notice) {
		return (
			<div className="min-h-screen">
				{/* 상단 네비게이션 */}
				<div>
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
						<div className="flex items-center justify-between h-14">
							<div className="py-4">
								<BackButton onClick={navigateToList} />
							</div>
						</div>
					</div>
				</div>

				{/* 메인 컨텐츠 */}
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
					<div className="p-6 sm:p-8">
						<ErrorState
							title="공지사항을 찾을 수 없습니다"
							message="요청하신 공지사항이 존재하지 않거나 삭제되었습니다."
							onRetry={navigateToList}
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
				<NoticeForm
					notice={notice}
					onSubmit={handleSubmit}
					onSuccess={handleCancel}
					onCancel={handleCancel}
				/>
			</div>
		</div>
	)
})

NoticeEditPageClient.displayName = 'NoticeEditPageClient'

export default NoticeEditPageClient
