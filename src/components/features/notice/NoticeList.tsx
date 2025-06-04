import React from 'react'
import NoticeCard, { NoticeCardProps } from './NoticeCard'

interface NoticeListProps {
	notices: NoticeCardProps['notice'][]
}

export default function NoticeList({ notices }: NoticeListProps) {
	if (!notices || notices.length === 0) {
		return (
			<div className="text-center text-gray-500 py-8">
				등록된 공지사항이 없습니다.
			</div>
		)
	}
	return (
		<div className="flex flex-col gap-4">
			{notices.map((notice) => (
				<NoticeCard key={notice.id} notice={notice} />
			))}
		</div>
	)
}
