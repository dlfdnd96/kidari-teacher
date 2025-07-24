'use client'

import React, { FC, useCallback } from 'react'
import { X } from 'lucide-react'

import { ApplicationForm } from '.'
import { Button } from '@/components/ui'
import type { ApplicationModalProps } from '@/types/application'
import { ZodType } from '@/shared/types'
import { ApplicationFormSchema } from '@/shared/schemas/application'
import { useApplicationActions } from '@/components/features/applications/hooks'

const ApplicationModal: FC<ApplicationModalProps> = ({
	open,
	onClose,
	volunteerActivityId,
	volunteerActivityTitle,
	onSuccess,
}) => {
	const { checkAuthentication, createApplicationMutation } =
		useApplicationActions()

	const handleSubmit = useCallback(
		async (data: ZodType<typeof ApplicationFormSchema>) => {
			if (!checkAuthentication()) {
				return
			}

			await createApplicationMutation.mutateAsync({
				volunteerActivityId,
				...data,
			})

			onSuccess()
			onClose()
		},
		[
			checkAuthentication,
			createApplicationMutation,
			onClose,
			onSuccess,
			volunteerActivityId,
		],
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
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-lg overflow-y-auto">
				{/* 헤더 영역 */}
				<header className="relative p-6 pb-4 border-b border-gray-200">
					<Button
						onClick={onClose}
						variant="ghost"
						size="icon"
						aria-label="모달 닫기"
						className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
					>
						<X className="h-4 w-4" />
					</Button>

					<h2
						id="modal-title"
						className="text-xl font-semibold text-gray-900 mb-2 pr-10"
					>
						봉사활동 신청
					</h2>
					<p id="modal-description" className="text-sm text-gray-600">
						{volunteerActivityTitle}
					</p>
				</header>

				{/* 폼 영역 */}
				<main className="p-6">
					<ApplicationForm
						volunteerActivityId={volunteerActivityId}
						onSubmit={handleSubmit}
						onCancel={onClose}
						onSuccess={onSuccess}
					/>
				</main>
			</div>
		</div>
	)
}

export default ApplicationModal
