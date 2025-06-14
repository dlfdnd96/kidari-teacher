'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, Send, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { ZodError } from 'zod/v4'
import { ApplicationFormSchema } from '@/shared/schemas/application'
import type { ApplicationFormProps } from '@/types/application'

const ApplicationForm = memo(
	({
		volunteerActivityId,
		volunteerActivityTitle,
		onSubmit,
		onCancel,
		isLoading = false,
	}: ApplicationFormProps) => {
		const { showError } = useErrorModal()

		const { register, handleSubmit, formState } = useForm({
			resolver: zodResolver(ApplicationFormSchema),
			defaultValues: {
				emergencyContact: '',
			},
		})

		const handleFormSubmit = useCallback(
			async (data: unknown) => {
				try {
					const validatedData = ApplicationFormSchema.parse(data)
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
						showError(errorMessage, '봉사활동 신청 오류')
					}
				}
			},
			[onSubmit, showError],
		)

		return (
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
				{/* 활동 정보 표시 */}
				<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
					<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						신청할 봉사활동
					</div>
					<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						{volunteerActivityTitle}
					</div>
				</div>

				{/* 긴급연락처 필드 */}
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
						{...register('emergencyContact', { required: true })}
						placeholder="예: 010-1234-5678"
						disabled={isLoading}
						className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
					/>
					{formState.errors.emergencyContact && (
						<p className="text-red-500 text-sm mt-1">
							{formState.errors.emergencyContact.message}
						</p>
					)}
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						활동 중 비상상황 발생 시 연락받을 번호를 입력해주세요.
					</p>
				</div>

				{/* 개인정보 동의 */}
				<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
					<div className="text-yellow-800 dark:text-yellow-200 text-sm">
						<strong>개인정보 수집·이용 동의</strong>
						<div className="mt-2 space-y-1">
							<div>• 수집항목: 이름, 이메일, 긴급연락처</div>
							<div>• 이용목적: 봉사활동 참가자 관리 및 비상연락</div>
							<div>• 보유기간: 활동 종료 후 1년</div>
						</div>
						<div className="mt-2 text-xs">
							신청 시 위 내용에 동의한 것으로 간주됩니다.
						</div>
					</div>
				</div>

				{/* 버튼들 */}
				<div className="flex flex-col sm:flex-row gap-3 pt-4">
					<Button
						type="submit"
						disabled={isLoading || formState.isSubmitting}
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
		)
	},
)

ApplicationForm.displayName = 'ApplicationForm'

export default ApplicationForm
