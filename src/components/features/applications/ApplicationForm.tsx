'use client'

import React, { memo, useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Send, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	ERROR_MESSAGES,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { ApplicationFormSchema } from '@/shared/schemas/application'
import type { ApplicationFormProps } from '@/types/application'
import { trpc } from '@/components/providers/TrpcProvider'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'

const ApplicationForm = memo(
	({
		volunteerActivityId,
		volunteerActivityTitle,
		onCancel,
		onClose,
	}: ApplicationFormProps) => {
		const router = useRouter()
		const { data: session } = useSession()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()

		const { handleSubmit, formState, setValue } = useForm()
		const [displayPhone, setDisplayPhone] = useState('')

		const { data: userProfile, isLoading: isLoadingProfile } =
			trpc.userProfile.getUserProfile.useQuery(undefined, {
				retry: false,
				staleTime: 5 * 60 * 1000,
			})

		useEffect(() => {
			if (userProfile?.phone) {
				const formatted = formatPhoneNumber(userProfile.phone)
				setDisplayPhone(formatted)
				setValue('emergencyContact', userProfile.phone)
			}
		}, [userProfile?.phone, setValue])

		const createApplicationMutation =
			trpc.application.createApplication.useMutation({
				onSuccess: async () => {
					await Promise.all([
						utils.volunteerActivity.getVolunteerActivityList.invalidate(),
						utils.application.getMyApplicationList.invalidate(),
					])
					router.refresh()
					onClose()
				},
				onError: (error) => {
					handleClientError(error, showError, '봉사활동 지원 등록 오류')
				},
			})

		const handlePhoneChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				const formatted = formatPhoneNumber(value)
				setDisplayPhone(formatted)

				const numbersOnly = removePhoneNumberFormat(formatted)
				setValue('emergencyContact', numbersOnly)
			},
			[setValue],
		)

		const onSubmit = useCallback(
			async (data: unknown) => {
				if (!session?.user) {
					handleClientError(
						ERROR_MESSAGES.AUTHENTICATION_ERROR,
						showError,
						'인증 오류',
					)
					return
				}

				try {
					const validatedData = ApplicationFormSchema.parse(data)
					await createApplicationMutation.mutateAsync({
						volunteerActivityId,
						emergencyContact: validatedData.emergencyContact,
					})
				} catch (error: unknown) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(error, showError, '봉사활동 지원 등록 오류')
					}
				}
			},
			[
				createApplicationMutation,
				session?.user,
				showError,
				volunteerActivityId,
			],
		)

		const isLoading = createApplicationMutation.isPending

		return (
			<>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* 활동 정보 표시 */}
					<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
						<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
							신청할 봉사활동
						</div>
						<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{volunteerActivityTitle}
						</div>
					</div>

					{/* 긴급연락처 필드 */}
					<div>
						<label
							htmlFor="emergency-contact"
							className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
						>
							<Phone className="w-4 h-4 mr-2" />
							<span>긴급연락처 *</span>
						</label>
						<Input
							id="emergency-contact"
							type="tel"
							value={displayPhone}
							onChange={handlePhoneChange}
							placeholder="010-1234-5678"
							disabled={isLoading || isLoadingProfile}
							className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
						/>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
							활동 중 비상상황 발생 시 연락받을 번호를 입력해주세요. (숫자만
							입력하면 자동으로 형식이 적용됩니다)
						</p>
					</div>

					{/* 버튼들 */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<Button
							type="submit"
							disabled={isLoading || formState.isSubmitting}
							className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
									<span>신청 중...</span>
								</>
							) : (
								<>
									<Send className="w-4 h-4 mr-1.5" />
									<span>신청하기</span>
								</>
							)}
						</Button>

						<Button
							type="button"
							onClick={onCancel}
							disabled={isLoading}
							variant="outline"
							className="flex-1 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							<X className="w-4 h-4 mr-1.5" />
							<span>취소</span>
						</Button>
					</div>
				</form>
			</>
		)
	},
)

ApplicationForm.displayName = 'ApplicationForm'

export default ApplicationForm
