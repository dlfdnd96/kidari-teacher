'use client'

import React, { FC, useCallback } from 'react'
import NoticeForm from '@/components/features/notice/NoticeForm'
import { NoticeModalProps } from '@/types/notice'

const NoticeModal: FC<NoticeModalProps> = ({ open, onClose }) => {
	const handleSuccess = useCallback(() => {
		onClose()
	}, [onClose])

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				onClose()
			}
		},
		[onClose],
	)

	if (!open) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
			onClick={handleBackdropClick}
		>
			<div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl relative border border-gray-100/50 dark:border-gray-700/50 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					aria-label="모달 닫기"
					className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

				{/* 모달 헤더 */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl p-6 sm:p-8">
					<div className="flex items-center">
						<div className="w-14 sm:w-16 h-14 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
							<span
								className="text-2xl sm:text-3xl text-white"
								role="img"
								aria-label="새 공지사항"
							>
								✍️
							</span>
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
								새 공지사항 작성
							</h2>
							<p className="text-blue-100 text-sm sm:text-base">
								중요한 정보를 모든 사용자에게 전달해보세요
							</p>
						</div>
					</div>
				</div>

				{/* 폼 컨테이너 */}
				<div className="p-0">
					<NoticeForm onSuccess={handleSuccess} isModal={true} />
				</div>
			</div>
		</div>
	)
}

export default NoticeModal
