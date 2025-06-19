'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Save, User, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	ERROR_MESSAGES,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { UpdateUserInputSchema } from '@/shared/schemas/user'
import type { ProfileFormProps } from '@/types/profile'
import { trpc } from '@/components/providers/TrpcProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ProfileForm = memo(({ onCancel, refetchUser }: ProfileFormProps) => {
	const { data: session, update: updateSession } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const { register, handleSubmit, formState } = useForm()

	const updateProfileMutation = trpc.user.updateProfile.useMutation({
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
		},
		onError: (error) => {
			handleClientError(error, showError, '프로필 업데이트 오류')
		},
	})

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
		[updateProfileMutation, session, showError],
	)

	const isLoading = updateProfileMutation.isPending

	return (
		<div className="relative">
			{/* 헤더 */}
			<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
				<div className="flex items-center">
					<User className="w-7 h-7 text-white mr-3" />
					<div>
						<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
							프로필 수정
						</h2>
						<p className="text-blue-100 text-sm">기본 정보를 수정하세요</p>
					</div>
				</div>
			</div>

			{/* 폼 */}
			<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
				<div className="space-y-6">
					{/* 이름 필드 */}
					<div>
						<label
							htmlFor="profile-name"
							className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
						>
							<User className="w-4 h-4 mr-2" />
							<span>이름 *</span>
						</label>
						<Input
							id="profile-name"
							{...register('name', { required: true })}
							placeholder="이름을 입력하세요"
							disabled={isLoading}
							className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
						/>
					</div>
					{/* 버튼들 */}
					<div className="flex flex-col sm:flex-row gap-3 pt-6">
						<Button
							type="submit"
							disabled={isLoading || formState.isSubmitting}
							className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
									<span>저장 중...</span>
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-1.5" />
									<span>저장</span>
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
				</div>
			</form>
		</div>
	)
})

ProfileForm.displayName = 'ProfileForm'

export default ProfileForm
