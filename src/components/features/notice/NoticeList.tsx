'use client'

import React, { memo } from 'react'
import { NoticeCard } from './components'
import { NoticeListProps } from '@/types/notice'

const NoticeList = memo(({ notices }: NoticeListProps) => {
	return (
		<div className="space-y-6 sm:space-y-8">
			{/* 전체 공지사항들 */}
			<div className="space-y-4">
				{notices.map((notice, index) => (
					<NoticeCard key={notice.id} notice={notice} index={index} />
				))}
			</div>
		</div>
	)
})

NoticeList.displayName = 'NoticeList'

export default NoticeList
