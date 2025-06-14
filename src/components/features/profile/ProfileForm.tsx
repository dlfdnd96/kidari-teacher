'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { ZodError } from 'zod/v4'
import { UpdateUserInputSchema } from '@/shared/schemas/user'
import type { ProfileFormProps } from '@/types/profile'

const ProfileForm = memo(
	({ user, onSubmit, onCancel, isLoading = false }: ProfileFormProps) => {
		const { showError } = useErrorModal()

		const { register, handleSubmit, formState } = useForm({
			resolver: zodResolver(UpdateUserInputSchema),
			defaultValues: {
				name: user.name ?? '',
				email: user.email ?? '',
			},
		})

		const handleFormSubmit = useCallback(
			async (data: unknown) => {
				try {
					const validatedData = UpdateUserInputSchema.parse(data)
					onSubmit(validatedData)
				} catch (error: unknown) {
					if (error instanceof ZodError) {
						showError(error.message, '입력 검증 오류')
					} else {
						console.error('Form error:', error)
						const errorMessage =
							error instanceof Error
								? error.message
								: '알 수 없는 오류가 발생했습니다.'
						showError(errorMessage, '프로필 업데이트 오류')
					}
				}
			},
			[onSubmit, showError],
		)

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
				<form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 sm:p-8">
					<div className="space-y-6">
						{/* 현재 프로필 이미지 표시 */}
						<div className="flex justify-center">
							<div className="relative">
								{user.image ? (
									<img
										src={user.image}
										alt={`${user.name}의 프로필`}
										className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
										<User className="w-12 h-12 text-white" />
									</div>
								)}
							</div>
						</div>

						{/* 소셜 로그인 안내 */}
						<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
							<div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
								<Mail className="w-4 h-4" />
								<span className="text-sm font-medium">
									소셜 로그인 계정입니다. 프로필 이미지는 연동된 계정에서
									자동으로 가져옵니다.
								</span>
							</div>
						</div>

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
							{formState.errors.name && (
								<p className="text-red-500 text-sm mt-1">
									{formState.errors.name.message}
								</p>
							)}
						</div>

						{/* 이메일 필드 */}
						<div>
							<label
								htmlFor="profile-email"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Mail className="w-4 h-4 mr-2" />
								<span>이메일 *</span>
							</label>
							<Input
								id="profile-email"
								type="email"
								{...register('email', { required: true })}
								placeholder="이메일을 입력하세요"
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
							/>
							{formState.errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{formState.errors.email.message}
								</p>
							)}
						</div>

						{/* 계정 정보 안내 */}
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
							<div className="text-yellow-800 dark:text-yellow-200 text-sm">
								<strong>참고:</strong> 이메일 변경 시 일부 기능에 영향을 줄 수
								있습니다. 변경 전에 신중히 검토해주세요.
							</div>
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
	},
)

ProfileForm.displayName = 'ProfileForm'

export default ProfileForm
