'use client'

import React, { FC, useCallback } from 'react'
import ApplicationForm from '@/components/features/applications/ApplicationForm'
import type { ApplicationModalProps } from '@/types/application'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'

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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			data-cy="application-modal"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
				{/* 닫기 버튼 */}
				<Button
					onClick={onClose}
					variant="ghost"
					size="icon"
					aria-label="모달 닫기"
					className="absolute top-4 right-4 z-10 w-8 h-8 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200 cursor-pointer"
				>
					<X className="w-5 h-5" />
				</Button>

				{/* 모달 헤더 */}
				<div className="p-6 pb-4">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						봉사활동 신청
					</h2>
					<p className="text-sm text-gray-600">{volunteerActivityTitle}</p>
				</div>

				{/* 폼 컨테이너 */}
				<div className="px-6 pb-6">
					<ApplicationForm
						volunteerActivityId={volunteerActivityId}
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
