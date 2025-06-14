'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
						showError(errorMessage, '신청 오류')
					}
				}
			},
			[onSubmit, showError],
		)

		return (
			<div className="space-y-6">
				{/* 봉사활동 정보 */}
				<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
					<div className="flex items-center mb-2">
						<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
						<h3 className="font-semibold text-blue-900 dark:text-blue-100">
							신청하실 봉사활동
						</h3>
					</div>
					<p className="text-blue-800 dark:text-blue-200 font-medium">
						{volunteerActivityTitle}
					</p>
				</div>

				{/* 신청 폼 */}
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
					{/* 긴급연락처 */}
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
							{...register('emergencyContact', { required: true })}
							placeholder="봉사활동 중 긴급시 연락받을 번호를 입력하세요 (예: 010-1234-5678)"
							disabled={isLoading}
							className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
						/>
						{formState.errors.emergencyContact && (
							<p className="text-red-500 text-sm mt-1">
								{formState.errors.emergencyContact.message}
							</p>
						)}
						<p className="text-xs text-gray-500 mt-1">
							본인이 아닌 가족이나 지인의 연락처를 입력해주세요. (부모님, 배우자
							등)
						</p>
					</div>

					{/* 안내 사항 */}
					<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
						<div className="flex items-start">
							<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 shrink-0" />
							<div>
								<h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
									신청 전 확인사항
								</h4>
								<ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
									<li>• 신청 후 선발 결과는 별도로 안내드립니다</li>
									<li>• 선발된 경우 반드시 참석해주셔야 합니다</li>
									<li>• 활동 시작 전까지는 신청을 취소할 수 있습니다</li>
									<li>• 긴급연락처는 정확하게 입력해주세요</li>
								</ul>
							</div>
						</div>
					</div>

					{/* 버튼들 */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<Button
							type="button"
							onClick={onCancel}
							variant="outline"
							disabled={isLoading}
							className="flex-1 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							취소
						</Button>

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
								<span>신청하기</span>
							)}
						</Button>
					</div>
				</form>
			</div>
		)
	},
)

ApplicationForm.displayName = 'ApplicationForm'

export default ApplicationForm
