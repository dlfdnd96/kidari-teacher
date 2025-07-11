'use client'

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarIcon, Save, User, X } from 'lucide-react'
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
import {
	UserProfileFormProps,
	FormHeaderProps,
	PhoneFieldProps,
	ProfessionFieldProps,
	OrganizationFieldProps,
	BirthDateFieldProps,
	ActionButtonsProps,
} from '@/types/user-profile'
import { useUserProfileActions, useUserProfileForm } from '../hooks'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import { UserProfileFormSchema } from '@/shared/schemas/user-profile'

const FormHeader = memo(({ headerTitle }: FormHeaderProps) => (
	<div className="border-b border-gray-200 p-6">
		<div className="flex items-center">
			<User className="w-5 h-5 text-gray-500 mr-3" />
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-1">
					{headerTitle}
				</h2>
			</div>
		</div>
	</div>
))

FormHeader.displayName = 'FormHeader'

const PhoneField = memo(
	({ displayPhone, handlePhoneChange, loading, errors }: PhoneFieldProps) => (
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
				disabled={loading}
				className="w-full"
				data-cy="user-profile-phone-input"
			/>
			<FieldError error={errors.phone?.message} />
		</div>
	),
)

PhoneField.displayName = 'PhoneField'

const ProfessionField = memo(
	({
		selectedProfessions,
		handleProfessionsChange,
		loading,
		errors,
	}: ProfessionFieldProps) => (
		<div>
			<ProfessionSelector
				selectedProfessions={selectedProfessions}
				onProfessionsChange={handleProfessionsChange}
				disabled={loading}
			/>
			<FieldError error={errors.professions?.message} />
		</div>
	),
)

ProfessionField.displayName = 'ProfessionField'

const OrganizationField = memo(
	({ register, loading }: OrganizationFieldProps) => (
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
				disabled={loading}
				className="w-full"
				data-cy="user-profile-organization-input"
			/>
		</div>
	),
)

OrganizationField.displayName = 'OrganizationField'

const BirthDateField = memo(
	({
		birthDate,
		setValue,
		userProfile,
		formattedDate,
	}: BirthDateFieldProps) => (
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
							!birthDate && 'text-muted-foreground',
						)}
					>
						{formattedDate ? (
							<span className="text-gray-900">{formattedDate}</span>
						) : (
							<span className="text-gray-500">생년월일을 선택하세요</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<CalendarCustom
						mode="single"
						selected={birthDate ?? undefined}
						onSelect={(date) => {
							if (!date) {
								return
							}

							const newDate = new TZDate(date, TIME_ZONE.SEOUL)
							newDate.setHours(23, 59, 59, 999)
							setValue('birthDate', newDate)
						}}
						defaultMonth={userProfile?.birthDate ?? undefined}
						captionLayout="dropdown"
						startMonth={new Date(1970, 0)}
						locale={ko}
					/>
				</PopoverContent>
			</Popover>
		</div>
	),
)

BirthDateField.displayName = 'BirthDateField'

const ActionButtons = memo(
	({ loading, onCancel, submitButtonText }: ActionButtonsProps) => (
		<div className="flex gap-3 pt-4 justify-center">
			<Button
				type="submit"
				disabled={loading}
				variant="outline"
				className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
				data-cy="user-profile-form-submit"
			>
				{loading ? (
					<>
						<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
						<span>저장 중...</span>
					</>
				) : (
					<>
						<Save className="w-4 h-4" />
						<span>{submitButtonText}</span>
					</>
				)}
			</Button>

			{onCancel && (
				<Button
					type="button"
					onClick={onCancel}
					disabled={loading}
					variant="outline"
					className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
					data-cy="user-profile-form-cancel"
				>
					<X className="w-4 h-4" />
					<span>취소</span>
				</Button>
			)}
		</div>
	),
)

ActionButtons.displayName = 'ActionButtons'

const UserProfileForm = memo(
	({ onCancel, isSetup = false, userProfile }: UserProfileFormProps) => {
		const {
			getUserProfileWithProfessionsQuery,
			createUserProfileMutation,
			updateUserProfileMutation,
			checkAuthentication,
		} = useUserProfileActions()

		const isEditing = !!userProfile

		const [displayPhone, setDisplayPhone] = useState(
			userProfile?.phone ? formatPhoneNumber(userProfile.phone) : '',
		)

		const [selectedProfessions, setSelectedProfessions] = useState<
			ZodType<typeof ZodEnum.Profession>[]
		>([])

		const { data: profileWithProfessions } = getUserProfileWithProfessionsQuery(
			undefined,
			{
				enabled: isEditing,
				retry: false,
			},
		)

		useEffect(() => {
			if (profileWithProfessions?.professions) {
				setSelectedProfessions(profileWithProfessions.professions)
			}
		}, [profileWithProfessions])

		const handleSubmit = useCallback(
			async (data: ZodType<typeof UserProfileFormSchema>) => {
				if (!checkAuthentication()) {
					return
				}

				const formData = {
					...data,
					professions: selectedProfessions,
				}

				if (isEditing) {
					await updateUserProfileMutation.mutateAsync(formData)
				} else {
					await createUserProfileMutation.mutateAsync(formData)
				}
			},
			[
				checkAuthentication,
				selectedProfessions,
				isEditing,
				updateUserProfileMutation,
				createUserProfileMutation,
			],
		)

		const {
			register,
			handleSubmit: handleFormSubmit,
			setValue,
			watch,
			formState: { errors },
		} = useUserProfileForm({
			onSubmit: handleSubmit,
			onCancel,
			userProfile,
		})

		const handlePhoneChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				const formatted = formatPhoneNumber(value)
				setDisplayPhone(formatted)

				const numbersOnly = removePhoneNumberFormat(formatted)
				setValue('phone', numbersOnly)
			},
			[setValue],
		)

		const handleProfessionsChange = useCallback(
			(professions: ZodType<typeof ZodEnum.Profession>[]) => {
				setSelectedProfessions(professions)
				setValue('professions', professions)
			},
			[setValue],
		)

		const loading = userProfile
			? updateUserProfileMutation.isPending
			: createUserProfileMutation.isPending

		const headerTitle = useMemo(() => {
			if (isSetup) {
				return '프로필 설정'
			}
			if (isEditing) {
				return '프로필 수정'
			}
			return '추가 정보 입력'
		}, [isSetup, isEditing])

		const birthDate = watch('birthDate')
		const formattedDate = useMemo(() => {
			if (!birthDate) {
				return null
			}
			return format(birthDate, 'yyyy년 M월 d일', { locale: ko })
		}, [birthDate])

		const submitButtonText = useMemo(() => {
			if (isSetup) {
				return '프로필 생성'
			}
			if (isEditing) {
				return '수정 완료'
			}
			return '저장'
		}, [isSetup, isEditing])

		return (
			<div
				className="bg-white border border-gray-200 rounded-lg"
				data-cy="user-profile-form"
			>
				<FormHeader headerTitle={headerTitle} />

				<form onSubmit={handleFormSubmit} className="p-6">
					<div className="space-y-6">
						<PhoneField
							displayPhone={displayPhone}
							handlePhoneChange={handlePhoneChange}
							loading={loading}
							errors={errors}
						/>

						<ProfessionField
							selectedProfessions={selectedProfessions}
							handleProfessionsChange={handleProfessionsChange}
							loading={loading}
							errors={errors}
						/>

						<OrganizationField register={register} loading={loading} />

						<BirthDateField
							birthDate={birthDate ?? null}
							setValue={setValue}
							userProfile={userProfile}
							formattedDate={formattedDate}
						/>

						<ActionButtons
							loading={loading}
							onCancel={onCancel}
							submitButtonText={submitButtonText}
						/>
					</div>
				</form>
			</div>
		)
	},
)

UserProfileForm.displayName = 'UserProfileForm'

export default UserProfileForm
