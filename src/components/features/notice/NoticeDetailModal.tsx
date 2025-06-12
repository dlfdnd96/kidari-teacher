'use client'

import React, { FC } from 'react'
import { NoticeDetailModalProps } from '@/types/notice'

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
				className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
				data-testid="notice-detail-modal"
			>
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					aria-label="모달 닫기"
					className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* 헤더 */}
				<div className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl p-6 sm:p-8">
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
										👤
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
										📅
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
				<div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
					<div className="prose prose-gray dark:prose-invert max-w-none">
						<div
							className="text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap"
							data-testid="notice-detail-content"
						>
							{notice.content}
						</div>
					</div>

					{/* 구분선 */}
					<div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

					{/* 추가 정보 */}
					<div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 sm:p-6">
						<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
							<div className="flex items-center">
								<span className="mr-2" role="img" aria-label="정보">
									ℹ️
								</span>
								<span>
									게시일: {notice.createdAt.toLocaleDateString('ko-KR')}
								</span>
							</div>
							<div className="flex items-center">
								<span className="mr-2" role="img" aria-label="작성자">
									👤
								</span>
								<span>{notice.author.name}</span>
							</div>
						</div>
					</div>
				</div>

				{/* 푸터 */}
				<div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-b-3xl shrink-0">
					<div className="flex justify-center">
						<button
							onClick={onClose}
							className="bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-hidden focus:ring-2 focus:ring-gray-500/50"
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
