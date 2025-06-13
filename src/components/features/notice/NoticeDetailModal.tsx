'use client'

import React, { FC } from 'react'
import { NoticeDetailModalProps } from '@/types/notice'
import { Calendar, PenLine, X } from 'lucide-react'

const NoticeDetailModal: FC<NoticeDetailModalProps> = ({
	open,
	onClose,
	notice,
}) => {
	if (!open || !notice) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col"
				onClick={(e) => e.stopPropagation()}
				data-testid="notice-detail-modal"
			>
				{/* 닫기 버튼 - 모바일 최적화 */}
				<button
					onClick={onClose}
					aria-label="모달 닫기"
					className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95 cursor-pointer"
				>
					<X />
				</button>

				{/* 헤더 */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl p-6 sm:p-8 pr-16 sm:pr-20">
					<div className="flex items-start">
						<div className="flex-1 min-w-0">
							<h2
								className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight"
								data-testid="notice-detail-title"
							>
								{notice.title}
							</h2>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-blue-100">
								<div
									className="flex items-center"
									data-testid="notice-detail-author"
								>
									<span className="mr-2" role="img" aria-label="작성자">
										<PenLine />
									</span>
									<span className="text-sm font-medium">
										{notice.author?.name ?? '관리자'}
									</span>
								</div>
								<div
									className="flex items-center"
									data-testid="notice-detail-date"
								>
									<span className="mr-2" role="img" aria-label="작성일">
										<Calendar />
									</span>
									<time
										dateTime={notice.createdAt.toLocaleDateString('ko-KR')}
										className="text-sm"
									>
										{notice.createdAt.toLocaleDateString('ko-KR', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											weekday: 'short',
										})}
									</time>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 내용 */}
				<div className="flex-1 p-6 sm:p-8 overflow-y-auto">
					<div className="prose prose-gray dark:prose-invert max-w-none">
						<div
							className="text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap"
							data-testid="notice-detail-content"
						>
							{notice.content}
						</div>
					</div>
				</div>

				{/* 푸터 */}
				<div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-b-3xl shrink-0">
					<div className="flex justify-center">
						<button
							onClick={onClose}
							className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 cursor-pointer"
							data-testid="notice-detail-confirm"
						>
							확인
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NoticeDetailModal
