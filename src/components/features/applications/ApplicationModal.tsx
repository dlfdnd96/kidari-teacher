'use client'

import React, { FC, useCallback } from 'react'
import ApplicationForm from '@/components/features/applications/ApplicationForm'
import type { ApplicationModalProps } from '@/types/application'
import { FileText, X } from 'lucide-react'

const ApplicationModal: FC<ApplicationModalProps> = ({
	open,
	onClose,
	volunteerActivityId,
	volunteerActivityTitle,
	onSuccess,
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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			data-testid="application-modal"
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
					<X className="w-6 h-6" />
				</button>

				{/* 모달 헤더 */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl p-6 sm:p-8">
					<div className="flex items-center">
						<FileText className="w-7 h-7 text-white mr-3" />
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
								봉사활동 신청
							</h2>
							<p className="text-blue-100 text-sm">{volunteerActivityTitle}</p>
						</div>
					</div>
				</div>

				{/* 안내 메시지 */}
				<div className="p-6 sm:p-8 pb-4">
					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
						<div className="flex items-start gap-3">
							<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
							<div className="text-blue-800 dark:text-blue-200">
								<div className="font-medium mb-1">신청 전 확인사항</div>
								<ul className="text-sm space-y-1">
									<li>• 신청 후 취소는 활동 시작 전까지만 가능합니다</li>
									<li>• 선발 결과는 신청 마감 후 안내드립니다</li>
									<li>• 긴급연락처는 정확히 입력해주세요</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* 폼 컨테이너 */}
				<div className="px-6 sm:px-8 pb-6 sm:pb-8">
					<ApplicationForm
						volunteerActivityId={volunteerActivityId}
						volunteerActivityTitle={volunteerActivityTitle}
						onCancel={onClose}
						onClose={onClose}
						onSuccess={onSuccess}
					/>
				</div>
			</div>
		</div>
	)
}

export default ApplicationModal
