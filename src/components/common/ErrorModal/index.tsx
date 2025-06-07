'use client'

import React, { useEffect } from 'react'

import { ErrorModalProps } from '@/types/error'

export default function ErrorModal({
	open,
	onClose,
	title = '오류',
	message,
}: ErrorModalProps) {
	useEffect(() => {
		if (!open) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [open, onClose])

	if (!open) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="error-modal-title"
			aria-describedby="error-modal-description"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose()
				}
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
				{/* 헤더 */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center">
						<div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
							<span
								className="text-red-600 dark:text-red-400 text-xl"
								role="img"
								aria-label="오류"
							>
								⚠️
							</span>
						</div>
						<h2
							id="error-modal-title"
							className="text-lg font-semibold text-gray-900 dark:text-gray-100"
						>
							{title}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
						aria-label="모달 닫기"
					>
						<svg
							className="w-5 h-5"
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
				</div>

				{/* 내용 */}
				<div className="mb-6">
					<p
						id="error-modal-description"
						className="text-gray-600 dark:text-gray-300 leading-relaxed"
					>
						{message}
					</p>
				</div>

				{/* 액션 버튼 */}
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
					>
						확인
					</button>
				</div>
			</div>
		</div>
	)
}
