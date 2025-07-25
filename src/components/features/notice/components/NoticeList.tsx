'use client'

import React, { memo } from 'react'
import { FileText, Plus } from 'lucide-react'
import { NoticeCard } from '.'
import { NoticeListProps, NoticeEmptyStateProps } from '@/types/notice'
import { Button } from '@/components/ui'

const NoticeEmptyState = memo(
	({
		title = '등록된 공지사항이 없습니다',
		description = '첫 번째 공지사항을 작성해보세요.',
		actionLabel = '공지사항 작성하기',
		onAction,
	}: NoticeEmptyStateProps) => (
		<div
			className="flex flex-col items-center justify-center py-16 px-4 text-center"
			role="status"
			aria-live="polite"
		>
			<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
				<FileText
					className="w-8 h-8 text-gray-400 dark:text-gray-500"
					aria-hidden="true"
				/>
			</div>

			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
				{title}
			</h3>

			<p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
				{description}
			</p>

			{onAction && (
				<Button
					onClick={onAction}
					className="flex items-center gap-2"
					aria-label={actionLabel}
				>
					<Plus className="w-4 h-4" aria-hidden="true" />
					{actionLabel}
				</Button>
			)}
		</div>
	),
)

NoticeEmptyState.displayName = 'NoticeEmptyState'

const NoticeList = memo(({ notices }: NoticeListProps) => {
	if (!notices || notices.length === 0) {
		return <NoticeEmptyState />
	}

	return (
		<section
			className="space-y-6 sm:space-y-8"
			aria-label="공지사항 목록"
			role="region"
		>
			<div className="space-y-4">
				{notices.map((notice, index) => (
					<NoticeCard key={notice.id} notice={notice} index={index} />
				))}
			</div>

			{/* 스크린 리더를 위한 추가 정보 */}
			<div className="sr-only" aria-live="polite">
				총 {notices.length}개의 공지사항이 있습니다.
			</div>
		</section>
	)
})

NoticeList.displayName = 'NoticeList'

export default NoticeList
