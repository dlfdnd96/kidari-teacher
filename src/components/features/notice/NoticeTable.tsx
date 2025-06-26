'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { NoticeTableProps } from '@/types/notice'

const NoticeTable = memo(({ notices }: NoticeTableProps) => {
	const router = useRouter()

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* 전체 공지사항들 */}
			<div className="space-y-4">
				{notices.map((notice, index) => (
					<div
						key={notice.id}
						className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md cursor-pointer overflow-hidden p-6 transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
						style={{
							animationDelay: `${index * 100}ms`,
						}}
						onClick={() => router.push(`/notice/${notice.id}`)}
					>
						{/* 카드 헤더 */}
						<div className="mb-4">
							{/* 제목 */}
							<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
								{notice.title}
							</h3>

							{/* 기본 정보 */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
								{/* 작성자 */}
								<div className="flex items-center gap-1">
									<span>작성자:</span>
									<span className="font-medium">
										{notice.author?.name || '관리자'}
									</span>
								</div>

								{/* 작성일 */}
								<div className="flex items-center gap-1">
									<Calendar className="w-3 h-3" />
									<span>
										{format(notice.createdAt, 'M월 d일 (E)', {
											locale: ko,
										})}
									</span>
								</div>

								{/* 조회수 (임시) */}
								<div className="flex items-center gap-1">
									<Eye className="w-3 h-3" />
									<span>0</span>
								</div>
							</div>
						</div>

						{/* 카드 푸터 */}
						<div className="pt-3 border-t border-gray-200 dark:border-gray-600">
							<div className="flex items-center justify-between min-h-[24px]">
								{/* 생성일 */}
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{format(notice.createdAt, 'yyyy.MM.dd')}
								</span>

								{/* 액션 버튼들 */}
								<div className="flex items-center gap-2 min-h-[24px]">
									{/* 여기에 필요한 액션 버튼들 추가 가능 */}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
})

NoticeTable.displayName = 'NoticeTable'

export default NoticeTable
