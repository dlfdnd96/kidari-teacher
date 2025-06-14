'use client'

import React, { FC, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import VolunteerActivityForm from './VolunteerActivityForm'
import type { CreateVolunteerActivityModalProps } from '@/types/volunteer-activity'
import { FileText } from 'lucide-react'
import { ZodType } from '@/shared/types'
import { CreateVolunteerActivityInputSchema } from '@/shared/schemas/volunteer-activity'

const CreateVolunteerActivityModal: FC<CreateVolunteerActivityModalProps> = ({
	open,
	onClose,
}) => {
	const { data: session } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const utils = trpc.useUtils()

	const createVolunteerActivityMutation =
		trpc.volunteerActivity.createVolunteerActivity.useMutation({
			onSuccess: async () => {
				await utils.volunteerActivity.getVolunteerActivityList.invalidate()
				router.refresh()
				onClose()
			},
			onError: (error) => {
				showError(error.message, '봉사활동 생성 오류')
			},
		})

	const handleFormSubmit = useCallback(
		async (data: ZodType<typeof CreateVolunteerActivityInputSchema>) => {
			if (!session?.user) {
				showError('로그인이 필요합니다.', '인증 오류')
				return
			}

			try {
				await createVolunteerActivityMutation.mutateAsync({
					title: data.title,
					description: data.description,
					startAt: data.startAt,
					endAt: data.endAt,
					location: data.location,
					applicationDeadline: data.applicationDeadline,
					maxParticipants: data.maxParticipants,
					qualifications: data.qualifications || '',
					materials: data.materials || '',
				})
			} catch (error) {
				console.error('Create error:', error)
				const errorMessage =
					error instanceof Error
						? error.message
						: '알 수 없는 오류가 발생했습니다.'
				showError(errorMessage, '봉사활동 생성 오류')
			}
		},
		[createVolunteerActivityMutation, session, showError],
	)

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

	const loading = createVolunteerActivityMutation.isPending

	if (!open) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
			data-testid="create-volunteer-activity-modal"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
			onClick={handleBackdropClick}
		>
			<div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl relative border border-gray-100/50 dark:border-gray-700/50 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					aria-label="모달 닫기"
					className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
				<div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-t-3xl p-6 sm:p-8">
					<div className="flex items-center">
						<FileText className="w-7 h-7 text-white mr-3" />
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
								새 봉사활동 생성
							</h2>
							<p className="text-emerald-100 text-sm">
								새로운 봉사활동을 등록하고 참가자를 모집하세요
							</p>
						</div>
					</div>
				</div>

				{/* 폼 컨테이너 */}
				<div className="p-0">
					<VolunteerActivityForm
						onSubmit={handleFormSubmit}
						onCancel={onClose}
						isLoading={loading}
						isModal={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default CreateVolunteerActivityModal
