import React from 'react'
import NoticeTable from '@/components/features/notice/NoticeTable'
import { NoticeListProps } from '@/types/notice'

export default function NoticeList({ notices }: NoticeListProps) {
	return (
		<div data-testid="notice-list">
			<NoticeTable notices={notices} />
		</div>
	)
}
