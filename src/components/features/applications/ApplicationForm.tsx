'use client'

import React, { memo, useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Send, X, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
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
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { PROFESSION_LABELS } from '@/constants/user-profile'

const ApplicationForm = memo(
	({
		volunteerActivityId,
		volunteerActivityTitle,
		onCancel,
		onClose,
		onSuccess,
	}: ApplicationFormProps) => {
		const router = useRouter()
		const { data: session } = useSession()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()

		const { handleSubmit, formState, setValue } = useForm()
		const [displayPhone, setDisplayPhone] = useState('')
		const [selectedProfession, setSelectedProfession] = useState<ZodType<
			typeof ZodEnum.Profession
		> | null>(null)

		const { data: userProfile, isLoading: isLoadingProfile } =
			trpc.userProfile.getUserProfile.useQuery(undefined, {
				retry: false,
				staleTime: 5 * 60 * 1000,
			})

		const { data: userProfileWithProfessions } =
			trpc.userProfile.getUserProfileWithProfessions.useQuery(undefined, {
				retry: false,
				staleTime: 5 * 60 * 1000,
			})

		const { data: applicationListResult } =
			trpc.application.getApplicationList.useQuery({
				filter: { volunteerActivityId },
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
						utils.application.getApplicationList.invalidate(),
					])
					router.refresh()
					onSuccess()
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

				if (!selectedProfession) {
					showError('신청할 직업을 선택해주세요.')
					return
				}

				try {
					const validatedData = ApplicationFormSchema.parse({
						emergencyContact: (data as any).emergencyContact,
						profession: selectedProfession,
					})
					await createApplicationMutation.mutateAsync({
						volunteerActivityId,
						emergencyContact: validatedData.emergencyContact,
						profession: validatedData.profession,
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
				selectedProfession,
			],
		)

		const isLoading = createApplicationMutation.isPending

		const userProfessions = userProfileWithProfessions?.professions || []
		const hasNoProfessions = userProfessions.length === 0

		const usedProfessions =
			applicationListResult?.applicationList.map((app) => app.profession) || []

		const availableProfessions = userProfessions.filter(
			(profession) => !usedProfessions.includes(profession),
		)

		const cannotApply = hasNoProfessions || availableProfessions.length === 0

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

					{/* 조건 안내 */}
					{hasNoProfessions && (
						<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
							<div className="text-sm text-red-700 dark:text-red-300">
								⚠️ 봉사활동 신청을 위해서는 프로필에 직업을 1개 이상 등록해야
								합니다.
							</div>
						</div>
					)}

					{!hasNoProfessions && availableProfessions.length === 0 && (
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
							<div className="text-sm text-yellow-700 dark:text-yellow-300">
								⚠️ 신청 가능한 직업이 없습니다. 이미 모든 직업으로 신청이
								완료되었습니다.
							</div>
						</div>
					)}

					{/* 직업 선택 필드 */}
					{!cannotApply && (
						<div>
							<label
								htmlFor="profession"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Briefcase className="w-4 h-4 mr-2" />
								<span>신청할 직업 *</span>
							</label>
							<Select
								value={selectedProfession || undefined}
								onValueChange={(value) =>
									setSelectedProfession(
										value as ZodType<typeof ZodEnum.Profession>,
									)
								}
								disabled={isLoading || isLoadingProfile}
							>
								<SelectTrigger className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200">
									<SelectValue placeholder="신청할 직업을 선택하세요" />
								</SelectTrigger>
								<SelectContent>
									{availableProfessions.map((profession) => (
										<SelectItem key={profession} value={profession}>
											{PROFESSION_LABELS[profession]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
								아직 신청되지 않은 직업만 선택할 수 있습니다. 한 봉사활동에는
								같은 직업으로 중복 신청할 수 없습니다.
							</p>
						</div>
					)}

					{/* 긴급연락처 필드 */}
					{!cannotApply && (
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
								입력하세요)
							</p>
						</div>
					)}

					{/* 버튼들 */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						{!cannotApply && (
							<Button
								type="submit"
								disabled={
									isLoading || formState.isSubmitting || !selectedProfession
								}
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
						)}

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
