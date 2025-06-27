'use client'

import React, { memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, X, Save } from 'lucide-react'
import { Input, FieldError, Button } from '@/components/ui'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { UpdateUserInputSchema } from '@/shared/schemas/user'
import type { ProfileFormProps } from '@/types/profile'
import { trpc } from '@/components/providers/TrpcProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { commonValidators } from '@/utils/validation'
import { useFieldValidation } from '@/hooks/useFieldValidation'

const ProfileForm = memo(({ onCancel, refetchUser }: ProfileFormProps) => {
	const { data: session, update: updateSession } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const { register, handleSubmit, formState, watch } = useForm()

	const validation = useFieldValidation()
	const { errors, clearError, validateAll } = validation

	const nameValue = watch('name')

	useEffect(() => {
		if (nameValue && nameValue.trim()) {
			clearError('name')
		}
	}, [nameValue, clearError])

	const updateProfileMutation = trpc.user.updateUser.useMutation({
		onSuccess: async (updatedUser) => {
			await updateSession({
				user: {
					...session?.user,
					name: updatedUser.name,
					email: updatedUser.email,
				},
			})

			await refetchUser()

			router.refresh()
			onCancel()
		},
		onError: (error) => {
			handleClientError(error, showError, '프로필 업데이트 오류')
		},
	})

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
			}

			const hasErrors = validateAll(data, validationRules)
			if (hasErrors) {
				return
			}

			try {
				const validatedData = UpdateUserInputSchema.parse(data)
				await updateProfileMutation.mutateAsync(validatedData)
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '프로필 업데이트 오류')
				}
			}
		},
		[updateProfileMutation, session, validateAll, showError],
	)

	const isLoading = updateProfileMutation.isPending

	return (
		<div className="bg-white border border-gray-200 rounded-lg">
			{/* 헤더 */}
			<div className="border-b border-gray-200 p-6">
				<div className="flex items-center">
					<User className="w-5 h-5 text-gray-500 mr-3" />
					<div>
						<h2 className="text-xl font-semibold text-gray-900 mb-1">
							프로필 수정
						</h2>
					</div>
				</div>
			</div>

			{/* 폼 */}
			<form onSubmit={handleSubmit(onSubmit)} className="p-6">
				<div className="space-y-6">
					{/* 이름 필드 */}
					<div>
						<label
							htmlFor="profile-name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							이름 *
						</label>
						<Input
							id="profile-name"
							{...register('name')}
							placeholder="이름을 입력하세요"
							defaultValue={session?.user?.name ?? ''}
							disabled={isLoading}
							className="w-full"
						/>
						<FieldError error={errors.name} />
					</div>

					{/* 버튼들 */}
					<div className="flex gap-3 pt-4 justify-center">
						<Button
							type="submit"
							disabled={isLoading || formState.isSubmitting}
							variant="outline"
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
									<span>저장 중...</span>
								</>
							) : (
								<>
									<Save className="w-4 h-4" />
									<span>수정 완료</span>
								</>
							)}
						</Button>

						<Button
							type="button"
							onClick={onCancel}
							disabled={isLoading}
							variant="outline"
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
						>
							<X className="w-4 h-4" />
							<span>취소</span>
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
})

ProfileForm.displayName = 'ProfileForm'

export default ProfileForm
