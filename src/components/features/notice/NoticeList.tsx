import React, { memo, useState, useCallback } from 'react'
import NoticeCard, { NoticeCardProps } from './NoticeCard'
import NoticeDetailModal from './NoticeDetailModal'
import { ZodType } from '@/shared/types'
import {
	NoticeEntitySchema,
	NoticeListEntitySchema,
} from '@/app/api/notice/schema'

interface NoticeListProps {
	notices: ZodType<typeof NoticeListEntitySchema>
}

const NoticeList = memo(({ notices }: NoticeListProps) => {
	const [selectedNotice, setSelectedNotice] = useState<ZodType<
		typeof NoticeEntitySchema
	> | null>(null)
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

	const handleViewDetail = useCallback((notice: NoticeCardProps['notice']) => {
		setSelectedNotice(notice)
		setIsDetailModalOpen(true)
	}, [])

	const handleCloseDetailModal = useCallback(() => {
		setIsDetailModalOpen(false)
		setSelectedNotice(null)
	}, [])
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
			{/* 목록 헤더 */}
			<div className="text-center mb-6 sm:mb-8">
				<div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-4">
					<span className="mr-2 text-lg" role="img" aria-label="공지사항 목록">
						📋
					</span>
					<span className="font-semibold text-sm sm:text-base">
						총 {notices.length}개의 공지사항
					</span>
				</div>
			</div>

			{/* 공지사항 카드들 */}
			<div className="space-y-4 sm:space-y-6">
				{notices.map((notice, index) => (
					<div
						key={notice.id}
						className="transform transition-all duration-300"
						style={{
							animationName: 'fadeInUp',
							animationDuration: '0.6s',
							animationTimingFunction: 'ease-out',
							animationFillMode: 'forwards',
							animationDelay: `${index * 100}ms`,
						}}
					>
						<NoticeCard notice={notice} onViewDetail={handleViewDetail} />
					</div>
				))}
			</div>

			{/* 푸터 정보 */}
			{notices.length > 0 && (
				<div className="text-center pt-6 sm:pt-8">
					<div className="inline-flex items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
						<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
							최신순으로 정렬되어 있습니다
						</span>
					</div>
				</div>
			)}

			{/* 공지사항 상세보기 모달 */}
			<NoticeDetailModal
				open={isDetailModalOpen}
				onClose={handleCloseDetailModal}
				notice={selectedNotice}
			/>

			{/* CSS 애니메이션 */}
			<style jsx>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	)
})

NoticeList.displayName = 'NoticeList'

export default NoticeList
