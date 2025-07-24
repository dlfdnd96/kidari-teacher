import React, { memo, useCallback, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
	NoticeCardProps,
	NoticeCardHeaderProps,
	NoticeCardMetaProps,
} from '@/types/notice'

const stripHtmlTags = (html: string): string => {
	return html.replace(/<[^>]*>/g, '').trim()
}

const formatNoticeDate = (date: Date): string => {
	return format(date, 'M월 d일 (E)', { locale: ko })
}

const NoticeCardHeader = memo(({ title, content }: NoticeCardHeaderProps) => (
	<div className="mb-4">
		<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
			{title}
		</h3>
		{content && (
			<p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
				{stripHtmlTags(content)}
			</p>
		)}
	</div>
))

NoticeCardHeader.displayName = 'NoticeCardHeader'

const NoticeCardMeta = memo(
	({ authorName, createdAt }: NoticeCardMetaProps) => (
		<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
			{/* 작성자 */}
			<div className="flex items-center gap-1.5">
				<User className="w-3 h-3" />
				<span className="font-medium">{authorName || '관리자'}</span>
			</div>

			{/* 작성일 */}
			<div className="flex items-center gap-1.5">
				<Calendar className="w-3 h-3" />
				<span>{formatNoticeDate(createdAt)}</span>
			</div>
		</div>
	),
)

NoticeCardMeta.displayName = 'NoticeCardMeta'

const NoticeCard = memo(({ notice, index = 0 }: NoticeCardProps) => {
	const router = useRouter()

	const handleClick = useCallback(() => {
		router.push(`/notice/${notice.id}`)
	}, [router, notice.id])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault()
				handleClick()
			}
		},
		[handleClick],
	)

	const cardAriaLabel = `공지사항: ${notice.title}. 작성자: ${notice.author?.name || '관리자'}. 작성일: ${formatNoticeDate(notice.createdAt)}`

	return (
		<div
			className="group border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md cursor-pointer overflow-hidden p-6 transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
			style={
				{
					'--animation-delay': `${index * 100}ms`,
					animationDelay: 'var(--animation-delay)',
				} as React.CSSProperties
			}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-label={cardAriaLabel}
			data-cy="notice-card"
		>
			<NoticeCardHeader title={notice.title} content={notice.content} />

			<NoticeCardMeta
				authorName={notice.author?.name || undefined}
				createdAt={notice.createdAt}
			/>
		</div>
	)
})

NoticeCard.displayName = 'NoticeCard'

export default NoticeCard
