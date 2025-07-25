'use client'

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { PROFESSION_LABELS } from '@/constants/user-profile'
import type { ApplicationFormProps } from '@/types/application'
import {
	useApplicationActions,
	useApplicationForm,
} from '@/components/features/applications/hooks'
import { useUserProfileActions } from '@/components/features/profile/hooks'

const ApplicationForm = memo<ApplicationFormProps>(
	({ volunteerActivityId, onSubmit, onCancel, onSuccess }) => {
		const { getApplicationListQuery, createApplicationMutation } =
			useApplicationActions()
		const { getUserProfileQuery, getUserProfileWithProfessionsQuery } =
			useUserProfileActions()

		const {
			handleSubmit: handleFormSubmit,
			setValue,
			formState: { errors },
		} = useApplicationForm({
			onSubmit,
			onSuccess,
		})

		const [displayPhone, setDisplayPhone] = useState('')
		const [selectedProfession, setSelectedProfession] = useState<ZodType<
			typeof ZodEnum.Profession
		> | null>(null)

		const { data: userProfile, isLoading: isLoadingProfile } =
			getUserProfileQuery(undefined, {
				retry: false,
				staleTime: 5 * 60 * 1000,
			})

		const { data: userProfileWithProfessions } =
			getUserProfileWithProfessionsQuery(undefined, {
				retry: false,
				staleTime: 5 * 60 * 1000,
			})

		const { data: applicationListResult } = getApplicationListQuery({
			filter: { volunteerActivityId },
		})

		useEffect(() => {
			if (userProfile?.phone) {
				const formatted = formatPhoneNumber(userProfile.phone)
				setDisplayPhone(formatted)
				setValue('emergencyContact', userProfile.phone)
			}
		}, [userProfile?.phone, setValue])

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

		const handleProfessionChange = useCallback(
			(value: string) => {
				setSelectedProfession(value as ZodType<typeof ZodEnum.Profession>)
				setValue('profession', value as ZodType<typeof ZodEnum.Profession>)
			},
			[setValue],
		)

		const isLoading = createApplicationMutation.isPending
		const userProfessions = useMemo(
			() => userProfileWithProfessions?.professions || [],
			[userProfileWithProfessions?.professions],
		)
		const hasNoProfessions = userProfessions.length === 0

		const usedProfessions = useMemo(
			() =>
				applicationListResult?.applicationList.map((app) => app.profession) ||
				[],
			[applicationListResult?.applicationList],
		)

		const availableProfessions = useMemo(
			() =>
				userProfessions.filter(
					(profession) => !usedProfessions.includes(profession),
				),
			[userProfessions, usedProfessions],
		)

		const cannotApply = hasNoProfessions || availableProfessions.length === 0

		const ProfessionRequiredAlert = () => (
			<div className="bg-red-50 border border-red-200 rounded-md p-3">
				<div className="text-sm text-red-700">
					⚠️ 봉사활동 신청을 위해서는 프로필에 직업을 1개 이상 등록해야 합니다.
				</div>
			</div>
		)

		const NoProfessionsAvailableAlert = () => (
			<div className="bg-amber-50 border border-amber-200 rounded-md p-3">
				<div className="text-sm text-amber-700">
					⚠️ 신청 가능한 직업이 없습니다. 이미 모든 직업으로 신청이
					완료되었습니다.
				</div>
			</div>
		)

		const ApplicationGuidelines = () => (
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
		)

		const ProfessionField = () => (
			<div data-cy="application-form-user-profile-profession-selector">
				<label
					htmlFor="profession"
					className="flex items-center text-sm font-medium text-gray-700 mb-2"
				>
					<Briefcase className="w-4 h-4 mr-2" />
					<span>신청할 직업</span>
				</label>
				<Select
					value={selectedProfession || undefined}
					onValueChange={handleProfessionChange}
					disabled={isLoading || isLoadingProfile}
				>
					<SelectTrigger
						className="w-full h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
						data-cy="application-form-user-profile-profession-select-box"
					>
						<SelectValue placeholder="신청할 직업을 선택하세요" />
					</SelectTrigger>
					<SelectContent>
						{availableProfessions.map((profession) => (
							<SelectItem
								key={profession}
								value={profession}
								data-cy={`application-form-user-profile-profession-${profession}`}
							>
								{PROFESSION_LABELS[profession]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<FieldError error={errors.profession?.message} />
				<p className="text-xs text-gray-500 mt-1">
					아직 신청되지 않은 직업만 선택할 수 있습니다.
				</p>
			</div>
		)

		const EmergencyContactField = () => (
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
					data-cy="application-form-emergency-contact-input"
				/>
				<FieldError error={errors.emergencyContact?.message} />
				<p className="text-xs text-gray-500 mt-1">
					활동 중 비상상황 발생 시 연락받을 번호를 입력해주세요.
				</p>
			</div>
		)

		const SubmitButton = () => (
			<Button
				type="submit"
				disabled={isLoading || !selectedProfession}
				className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				data-cy="apply-application-form-button"
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
		)

		return (
			<form onSubmit={handleFormSubmit} className="space-y-5">
				{/* 조건 알림 */}
				{hasNoProfessions && <ProfessionRequiredAlert />}
				{!hasNoProfessions && availableProfessions.length === 0 && (
					<NoProfessionsAvailableAlert />
				)}

				{/* 폼 필드들 */}
				{!cannotApply && (
					<>
						<ProfessionField />
						<EmergencyContactField />
						<ApplicationGuidelines />
					</>
				)}

				{/* 액션 버튼들 */}
				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						variant="outline"
						className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
						data-cy="cancel-application-form-button"
					>
						취소
					</Button>
					{!cannotApply && <SubmitButton />}
				</div>
			</form>
		)
	},
)

ApplicationForm.displayName = 'ApplicationForm'

export default ApplicationForm
