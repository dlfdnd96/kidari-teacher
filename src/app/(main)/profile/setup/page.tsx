'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Building, Phone, User } from 'lucide-react'
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
		<main className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
			{/* 히어로 섹션 */}
			<section className="relative max-w-5xl mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8">
				{/* 배경 장식 */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -z-10" />

				<div className="text-center">
					{/* 메인 아이콘 */}
					<div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6 sm:mb-8 shadow-2xl">
						<User className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
					</div>

					{/* 제목 */}
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
						프로필 설정
					</h1>

					{/* 구분선 */}
					<div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto rounded-full mb-4 sm:mb-6" />

					{/* 설명 */}
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
						서비스 이용을 위해 추가 정보를 입력해주세요
					</p>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-2xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				{/* 폼 카드 */}
				<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl p-8">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* 이름 */}
						<div>
							<label
								htmlFor="user-name"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<User className="w-4 h-4 mr-2" />
								<span>이름 *</span>
							</label>
							<Input
								id="user-name"
								{...register('name')}
								placeholder="이름을 입력하세요"
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
							<FieldError error={errors.name} />
						</div>

						{/* 이메일 */}
						<div>
							<label
								htmlFor="user-email"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<User className="w-4 h-4 mr-2" />
								<span>이메일 *</span>
							</label>
							<Input
								id="user-email"
								{...register('email')}
								placeholder="이메일을 입력하세요"
								disabled={true}
								readOnly
								className="bg-gray-100/80 dark:bg-gray-600/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base cursor-not-allowed opacity-75"
							/>
						</div>

						{/* 연락처 */}
						<div>
							<label
								htmlFor="user-phone"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Phone className="w-4 h-4 mr-2" />
								<span>연락처 *</span>
							</label>
							<Input
								id="user-phone"
								type="tel"
								placeholder="010-1234-5678"
								value={displayPhone}
								onChange={handlePhoneChange}
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
							<FieldError error={errors.phone} />
						</div>

						{/* 직업 선택 */}
						<div>
							<ProfessionSelector
								selectedProfessions={selectedProfessions}
								onProfessionsChange={handleProfessionsChange}
								disabled={isLoading}
							/>
							<FieldError error={errors.professions} />
						</div>

						{/* 소속 기관 */}
						<div>
							<label
								htmlFor="user-organization"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Building className="w-4 h-4 mr-2" />
								<span>소속 기관</span>
							</label>
							<Input
								id="user-organization"
								{...register('organization')}
								placeholder="회사명 또는 학교명"
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
						</div>

						{/* 제출 버튼 */}
						<div className="pt-4">
							<button
								type="submit"
								disabled={isLoading}
								className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
										<span>프로필 생성 중...</span>
									</>
								) : (
									<span>프로필 생성하기</span>
								)}
							</button>
						</div>
					</form>
				</div>

				{/* 푸터 텍스트 */}
				<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
					언제든지 프로필 설정에서 정보를 수정할 수 있습니다.
				</p>
			</section>

			{/* 장식적 배경 요소 */}
			<div className="fixed top-1/4 right-10 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl -z-10" />
			<div className="fixed bottom-1/4 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-emerald-400/10 rounded-full blur-2xl -z-10" />
		</main>
	)
}
