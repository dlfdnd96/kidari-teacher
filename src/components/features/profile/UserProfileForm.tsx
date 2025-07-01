'use client'

import React, { memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CalendarIcon, User, X, Save } from 'lucide-react'
import {
	Button,
	CalendarCustom,
	FieldError,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ProfessionSelector,
} from '@/components/ui'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import {
	CreateUserProfileInputSchema,
	UpdateUserProfileInputSchema,
} from '@/shared/schemas/user-profile'
import { trpc } from '@/components/providers/TrpcProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserProfileFormProps } from '@/types/user-profile'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { commonValidators } from '@/utils/validation'

const UserProfileForm = memo(
	({ onCancel, isSetup = false, initialData }: UserProfileFormProps) => {
		const { data: session } = useSession()
		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()
		const isEditing = !!initialData

		const { register, handleSubmit, formState, setValue, watch } = useForm({
			defaultValues: {
				phone: initialData?.phone,
				birthDate: initialData?.birthDate,
				organization: initialData?.organization,
			},
		})
		const [displayPhone, setDisplayPhone] = useState(
			initialData?.phone ? formatPhoneNumber(initialData.phone) : '',
		)
		const [selectedProfessions, setSelectedProfessions] = useState<
			ZodType<typeof ZodEnum.Profession>[]
		>([])

		const validation = useFieldValidation()
		const { errors, clearError, validateAll } = validation

		const { data: profileWithProfessions } =
			trpc.userProfile.getUserProfileWithProfessions.useQuery(undefined, {
				enabled: isEditing,
				retry: false,
			})

		useEffect(() => {
			if (profileWithProfessions?.professions) {
				setSelectedProfessions(profileWithProfessions.professions)
			}
		}, [profileWithProfessions])

		const createProfileMutation =
			trpc.userProfile.createUserProfile.useMutation({
				onSuccess: async () => {
					await utils.userProfile.getUserProfile.invalidate()
					await utils.userProfile.getUserProfileWithProfessions.invalidate()
					router.refresh()
					onCancel()
				},
				onError: (error) => {
					handleClientError(error, showError, '프로필 생성 오류')
				},
			})

		const updateProfileMutation =
			trpc.userProfile.updateUserProfile.useMutation({
				onSuccess: async () => {
					await utils.userProfile.getUserProfile.invalidate()
					await utils.userProfile.getUserProfileWithProfessions.invalidate()
					router.refresh()
					onCancel()
				},
				onError: (error) => {
					handleClientError(error, showError, '프로필 수정 오류')
				},
			})

		const handlePhoneChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				const formatted = formatPhoneNumber(value)
				setDisplayPhone(formatted)

				const numbersOnly = removePhoneNumberFormat(formatted)
				setValue('phone', numbersOnly)

				if (numbersOnly) {
					clearError('phone')
				}
			},
			[setValue, clearError],
		)

		const handleProfessionsChange = useCallback(
			(professions: ZodType<typeof ZodEnum.Profession>[]) => {
				setSelectedProfessions(professions)
				if (professions.length > 0) {
					clearError('professions')
				}
			},
			[clearError],
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
					phone: commonValidators.requiredPhone(data.phone),
					professions: commonValidators.requiredProfessions,
				}

				const validationData = {
					...data,
					professions: selectedProfessions,
				}

				const hasErrors = validateAll(validationData, validationRules)
				if (hasErrors) {
					return
				}

				try {
					const formData = {
						...data,
						professions: selectedProfessions,
					}

					if (isEditing) {
						const validatedData = UpdateUserProfileInputSchema.parse(formData)
						await updateProfileMutation.mutateAsync(validatedData)
					} else {
						const validatedData = CreateUserProfileInputSchema.parse(formData)
						await createProfileMutation.mutateAsync(validatedData)
					}
				} catch (error: unknown) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(
							error,
							showError,
							isEditing ? '프로필 수정 오류' : '프로필 생성 오류',
						)
					}
				}
			},
			[
				validateAll,
				createProfileMutation,
				updateProfileMutation,
				session,
				showError,
				isEditing,
				selectedProfessions,
			],
		)

		const isLoading =
			createProfileMutation.isPending || updateProfileMutation.isPending

		return (
			<div
				className="bg-white border border-gray-200 rounded-lg"
				data-cy="user-profile-form"
			>
				{/* 헤더 */}
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center">
						<User className="w-5 h-5 text-gray-500 mr-3" />
						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-1">
								{isSetup
									? '프로필 설정'
									: isEditing
										? '프로필 수정'
										: '추가 정보 입력'}
							</h2>
						</div>
					</div>
				</div>

				{/* 폼 */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-6">
					<div className="space-y-6">
						{/* 휴대폰 번호 필드 */}
						<div>
							<label
								htmlFor="profile-phone"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								휴대폰 번호 *
							</label>
							<Input
								id="profile-phone"
								type="tel"
								value={displayPhone}
								onChange={handlePhoneChange}
								placeholder="010-1234-5678"
								disabled={isLoading}
								className="w-full"
								data-cy="user-profile-phone-input"
							/>
							<FieldError error={errors.phone} />
						</div>

						{/* 직업 선택 필드 */}
						<div>
							<ProfessionSelector
								selectedProfessions={selectedProfessions}
								onProfessionsChange={handleProfessionsChange}
								disabled={isLoading}
							/>
							<FieldError error={errors.professions} />
						</div>

						{/* 소속 기관 필드 */}
						<div>
							<label
								htmlFor="profile-organization"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								소속 기관
							</label>
							<Input
								id="profile-organization"
								{...register('organization')}
								placeholder="소속 기관을 입력하세요"
								disabled={isLoading}
								className="w-full"
								data-cy="user-profile-organization-input"
							/>
						</div>

						{/* 생년월일 필드 */}
						<div>
							<label
								htmlFor="profile-birthDate"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								생년월일
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal',
											!watch('birthDate') && 'text-muted-foreground',
										)}
									>
										{watch('birthDate') ? (
											<span className="text-gray-900">
												{format(watch('birthDate')!, 'yyyy년 M월 d일', {
													locale: ko,
												})}
											</span>
										) : (
											<span className="text-gray-500">
												생년월일을 선택하세요
											</span>
										)}
										<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<CalendarCustom
										mode="single"
										selected={watch('birthDate') ?? undefined}
										onSelect={(date) => {
											if (!date) {
												return
											}

											const newDate = new TZDate(date, TIME_ZONE.SEOUL)
											newDate.setHours(23, 59, 59, 999)
											setValue('birthDate', newDate)
										}}
										defaultMonth={initialData?.birthDate ?? undefined}
										captionLayout="dropdown"
										startMonth={new Date(1970, 0)}
										locale={ko}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* 버튼들 */}
						<div className="flex gap-3 pt-4 justify-center">
							<Button
								type="submit"
								disabled={isLoading || formState.isSubmitting}
								variant="outline"
								className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
								data-cy="user-profile-form-submit"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
										<span>저장 중...</span>
									</>
								) : (
									<>
										<Save className="w-4 h-4" />
										<span>
											{isSetup
												? '프로필 생성'
												: isEditing
													? '수정 완료'
													: '저장'}
										</span>
									</>
								)}
							</Button>

							{onCancel && (
								<Button
									type="button"
									onClick={onCancel}
									disabled={isLoading}
									variant="outline"
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
									data-cy="user-profile-form-cancel"
								>
									<X className="w-4 h-4" />
									<span>취소</span>
								</Button>
							)}
						</div>
					</div>
				</form>
			</div>
		)
	},
)

UserProfileForm.displayName = 'UserProfileForm'

export default UserProfileForm
