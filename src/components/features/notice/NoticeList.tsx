import React from 'react'
import NoticeCard from '@/components/features/notice/NoticeCard'
import { NoticeListProps } from '@/types/notice'

export default function NoticeList({ notices, onViewDetail }: NoticeListProps) {
	return (
		<div className="space-y-6 sm:space-y-8" data-testid="notice-list">
			{/* 공지사항 카드들 */}
			<div className="space-y-4 sm:space-y-6">
				{notices.map((notice, index) => (
					<div
						key={notice.id}
						className="transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
						style={{
							animationDelay: `${index * 100}ms`,
						}}
					>
						<NoticeCard notice={notice} onViewDetail={onViewDetail} />
					</div>
				))}
			</div>
		</div>
	)
}
