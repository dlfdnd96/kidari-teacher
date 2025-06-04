'use client'

import React, { FC, useCallback } from 'react'

interface ErrorModalProps {
	open: boolean
	onClose: () => void
	title?: string
	message: string
}

const ErrorModal: FC<ErrorModalProps> = ({
	open,
	onClose,
	title = '오류 발생',
	message,
}) => {
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
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
			onClick={handleBackdropClick}
		>
			<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ring-4 ring-orange-500/20 w-full max-w-lg relative border-4 border-orange-300 dark:border-orange-700 transform transition-all duration-300">
				{/* 강조 효과 */}
				<div className="absolute -inset-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
				<div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
					{/* 닫기 버튼 */}
					<button
						onClick={onClose}
						aria-label="모달 닫기"
						className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
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
					<div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-t-3xl p-8">
						<div className="flex items-center">
							<div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6 shadow-lg">
								<span
									className="text-3xl text-white drop-shadow-lg"
									role="img"
									aria-label="오류"
								>
									⚠️
								</span>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
									{title}
								</h2>
								<p className="text-red-100 text-base font-medium">
									문제가 발생했습니다
								</p>
							</div>
						</div>
					</div>

					{/* 내용 */}
					<div className="p-8">
						<div className="text-center mb-8">
							<div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<span className="text-4xl" role="img" aria-label="에러">
									❌
								</span>
							</div>
							<div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border-l-4 border-red-400 mb-6">
								<p className="text-red-700 dark:text-red-300 text-base font-medium break-words">
									{message}
								</p>
							</div>
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								문제가 지속되면 관리자에게 문의해주세요.
							</p>
						</div>

						{/* 확인 버튼 */}
						<div className="flex justify-center">
							<button
								onClick={onClose}
								className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
							>
								<span className="mr-2" role="img" aria-label="확인">
									👍
								</span>
								확인
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ErrorModal
