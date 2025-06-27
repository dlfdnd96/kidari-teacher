'use client'

import React, { memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Briefcase, Phone } from 'lucide-react'
import {
	Button,
	FieldError,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	CLIENT_ERROR_KEY_MAPPING,
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
import { commonValidators, validators } from '@/utils/validation'
import { useFieldValidation } from '@/hooks/useFieldValidation'

const ApplicationForm = memo(
	({
		volunteerActivityId,
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

		const validation = useFieldValidation()
		const { errors, clearError, validateAll } = validation

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

				if (numbersOnly) {
					clearError('emergencyContact')
				}
			},
			[setValue, clearError],
		)

		const onSubmit = useCallback(
			async (data: Record<string, unknown>) => {
				if (!session?.user) {
					handleClientError(
						CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
						showError,
						'인증 오류',
					)
					return
				}

				const validationRules = {
					emergencyContact: commonValidators.requiredPhone(
						data.emergencyContact,
					),
					profession: validators.required('직업을 선택해주세요'),
				}

				const validationData = {
					...data,
					profession: selectedProfession,
				}

				const hasErrors = validateAll(validationData, validationRules)
				if (hasErrors) {
					return
				}

				try {
					const validatedData = ApplicationFormSchema.parse({
						emergencyContact: data.emergencyContact,
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
				validateAll,
				createApplicationMutation,
				session,
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
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{/* 조건 안내 */}
				{hasNoProfessions && (
					<div className="bg-red-50 border border-red-200 rounded-md p-3">
						<div className="text-sm text-red-700">
							⚠️ 봉사활동 신청을 위해서는 프로필에 직업을 1개 이상 등록해야
							합니다.
						</div>
					</div>
				)}

				{!hasNoProfessions && availableProfessions.length === 0 && (
					<div className="bg-amber-50 border border-amber-200 rounded-md p-3">
						<div className="text-sm text-amber-700">
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
							className="flex items-center text-sm font-medium text-gray-700 mb-2"
						>
							<Briefcase className="w-4 h-4 mr-2" />
							<span>신청할 직업</span>
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
							<SelectTrigger className="w-full h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
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
						<FieldError error={errors.profession} />
						<p className="text-xs text-gray-500 mt-1">
							아직 신청되지 않은 직업만 선택할 수 있습니다.
						</p>
					</div>
				)}

				{/* 긴급연락처 필드 */}
				{!cannotApply && (
					<div>
						<label
							htmlFor="emergency-contact"
							className="flex items-center text-sm font-medium text-gray-700 mb-2"
						>
							<Phone className="w-4 h-4 mr-2" />
							<span>긴급연락처</span>
						</label>
						<Input
							id="emergency-contact"
							type="tel"
							value={displayPhone}
							onChange={handlePhoneChange}
							placeholder="010-1234-5678"
							disabled={isLoading || isLoadingProfile}
							className="w-full h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						/>
						<FieldError error={errors.emergencyContact} />
						<p className="text-xs text-gray-500 mt-1">
							활동 중 비상상황 발생 시 연락받을 번호를 입력해주세요.
						</p>
					</div>
				)}

				{/* 안내 사항 */}
				{!cannotApply && (
					<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
						<div className="text-sm text-blue-700">
							<div className="font-medium mb-1">신청 전 확인사항</div>
							<ul className="text-xs space-y-0.5 ml-2">
								<li>• 신청 후 취소는 활동 시작 전까지만 가능합니다</li>
								<li>• 선발 결과는 신청 마감 후 안내드립니다</li>
								<li>• 긴급연락처는 정확히 입력해주세요</li>
							</ul>
						</div>
					</div>
				)}

				{/* 버튼들 */}
				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						variant="outline"
						className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
					>
						취소
					</Button>

					{!cannotApply && (
						<Button
							type="submit"
							disabled={
								isLoading || formState.isSubmitting || !selectedProfession
							}
							className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium cursor-pointer rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
									신청 중...
								</>
							) : (
								'신청하기'
							)}
						</Button>
					)}
				</div>
			</form>
		)
	},
)

ApplicationForm.displayName = 'ApplicationForm'

export default ApplicationForm
