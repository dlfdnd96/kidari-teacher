'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Building, Phone, User, Briefcase, Save } from 'lucide-react'
import { trpc } from '@/components/providers/TrpcProvider'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { InitialUserProfileInputSchema } from '@/shared/schemas/user-profile'
import { Input } from '@/components/ui/input'
import { FieldError, ProfessionSelector } from '@/components/ui'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { useFieldValidation } from '@/hooks/useFieldValidation'
import { commonValidators } from '@/utils/validation'

export default function ProfileSetupPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const [displayPhone, setDisplayPhone] = useState('')
	const [selectedProfessions, setSelectedProfessions] = useState<
		ZodType<typeof ZodEnum.Profession>[]
	>([])

	const validation = useFieldValidation()
	const { errors, clearError, validateAll } = validation

	const { register, handleSubmit, setValue, watch } = useForm({
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			organization: '',
		},
	})

	const nameValue = watch('name')

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			setValue('name', session.user.name ?? '')
			setValue('email', session.user.email ?? '')
		}
	}, [session, status, setValue])

	useEffect(() => {
		if (nameValue && nameValue.trim()) {
			clearError('name')
		}
	}, [nameValue, clearError])

	const initializeUserProfileMutation =
		trpc.userProfile.initializeUserProfile.useMutation({
			onError: (error) => {
				handleClientError(error, showError, '프로필 등록 오류')
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
				name: commonValidators.requiredName(data.name),
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
				const validatedData = InitialUserProfileInputSchema.parse(formData)
				const result =
					await initializeUserProfileMutation.mutateAsync(validatedData)

				if (result) {
					router.push('/')
				}
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '프로필 등록 오류')
				}
			}
		},
		[
			session,
			initializeUserProfileMutation,
			router,
			showError,
			selectedProfessions,
			validateAll,
		],
	)

	const isLoading = initializeUserProfileMutation.isPending

	if (status === 'loading') {
		return <div>로딩 중...</div>
	}

	if (status === 'unauthenticated') {
		router.push('/')
		return null
	}

	return (
		<div className="min-h-screen" data-cy="profile-setup-page">
			{/* 메인 컨텐츠 */}
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
				<div className="p-6 sm:p-8">
					{/* 헤더 */}
					<div className="mb-8">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
									프로필 설정
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									서비스 이용을 위해 추가 정보를 입력해주세요
								</p>
							</div>
						</div>
						<div className="border-b border-gray-200 dark:border-gray-700"></div>
					</div>

					{/* 폼 */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						{/* 기본 정보 섹션 */}
						<div className="space-y-6">
							{/* 이름 */}
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="user-name"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										이름 *
									</label>
									<Input
										id="user-name"
										{...register('name')}
										placeholder="이름을 입력하세요"
										disabled={isLoading}
										className="w-full h-12"
										data-cy="setup-profile-name-input"
									/>
									<FieldError error={errors.name} />
								</div>
							</div>

							{/* 이메일 */}
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="user-email"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										이메일 *
									</label>
									<Input
										id="user-email"
										{...register('email')}
										placeholder="이메일을 입력하세요"
										disabled={true}
										readOnly
										className="w-full h-12 bg-gray-50 cursor-not-allowed"
									/>
								</div>
							</div>

							{/* 연락처 */}
							<div className="flex items-start gap-3">
								<Phone className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="user-phone"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										연락처 *
									</label>
									<Input
										id="user-phone"
										type="tel"
										placeholder="010-1234-5678"
										value={displayPhone}
										onChange={handlePhoneChange}
										disabled={isLoading}
										className="w-full h-12"
										data-cy="setup-user-profile-phone-input"
									/>
									<FieldError error={errors.phone} />
								</div>
							</div>

							{/* 직업 선택 */}
							<div className="flex items-start gap-3">
								<Briefcase className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<ProfessionSelector
										selectedProfessions={selectedProfessions}
										onProfessionsChange={handleProfessionsChange}
										disabled={isLoading}
									/>
									<FieldError error={errors.professions} />
								</div>
							</div>

							{/* 소속 기관 */}
							<div className="flex items-start gap-3">
								<Building className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="user-organization"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										소속 기관
									</label>
									<Input
										id="user-organization"
										{...register('organization')}
										placeholder="소속 기관을 입력하세요"
										disabled={isLoading}
										className="w-full h-12"
										data-cy="setup-user-profile-organization-input"
									/>
								</div>
							</div>
						</div>

						{/* 제출 버튼 영역 */}
						<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
							<div className="flex justify-center gap-4">
								<button
									type="submit"
									disabled={isLoading}
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
									data-cy="setup-profile-submit-button"
								>
									{isLoading ? (
										<>
											<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
											<span>프로필 생성 중...</span>
										</>
									) : (
										<>
											<Save className="w-4 h-4" />
											<span>프로필 생성하기</span>
										</>
									)}
								</button>
							</div>
						</div>
					</form>

					{/* 푸터 텍스트 */}
					<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
						<p className="text-center text-sm text-gray-500 dark:text-gray-400">
							언제든지 프로필 설정에서 정보를 수정할 수 있습니다.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
