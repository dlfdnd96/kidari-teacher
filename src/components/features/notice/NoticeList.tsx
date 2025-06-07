import React from 'react'
import NoticeCard from './NoticeCard'
import { ZodType } from '@/shared/types'
import {
	NoticeEntitySchema,
	NoticeListEntitySchema,
} from '@/shared/schemas/notice'

interface NoticeListProps {
	notices: ZodType<typeof NoticeListEntitySchema>
	onViewDetail?: (notice: ZodType<typeof NoticeEntitySchema>) => void
}

export default function NoticeList({ notices, onViewDetail }: NoticeListProps) {
	if (!notices || notices.length === 0) {
		return (
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
				{/* 빈 상태 일러스트레이션 */}
				<div className="max-w-md mx-auto">
					<div className="w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
						<span
							className="text-4xl sm:text-5xl text-gray-400 dark:text-gray-500"
							role="img"
							aria-label="빈 공지사항"
						>
							📭
						</span>
					</div>

					<h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
						아직 공지사항이 없습니다
					</h3>

					<p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
						새로운 공지사항이 등록되면 이곳에 표시됩니다.
						<br className="hidden sm:block" />
						정기적으로 확인해주세요!
					</p>

					{/* 장식적 요소 */}
					<div className="flex justify-center space-x-4 opacity-30">
						<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
						<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
						<div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 sm:space-y-8">
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
