'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import { ZodError } from 'zod/v4'

import { NoticeEditFormSchema } from '@/shared/schemas/notice'
import { NoticeEditFormProps } from '@/types/notice'

const NoticeEditForm = memo(
	({ id, initialTitle, initialContent, onCancel }: NoticeEditFormProps) => {
		const { register, handleSubmit, formState } = useForm({
			defaultValues: { title: initialTitle, content: initialContent },
		})
		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()
		const updateNoticeMutation = trpc.notice.updateNotice.useMutation({
			onSuccess: async () => {
				await utils.notice.getNoticeList.invalidate()
				router.refresh()
				onCancel()
			},
			onError: (error) => {
				showError(error.message, '공지사항 수정 오류')
			},
		})

		const onSubmit = useCallback(
			async (data: unknown) => {
				try {
					const validatedData = NoticeEditFormSchema.parse(data)
					await updateNoticeMutation.mutateAsync({
						id,
						title: validatedData.title,
						content: validatedData.content,
					})
				} catch (error: unknown) {
					if (error instanceof ZodError) {
						showError(error.message, '입력 검증 오류')
					} else {
						console.error('Update error:', error)

						const errorMessage =
							error instanceof Error
								? error.message
								: '알 수 없는 오류가 발생했습니다.'
						showError(errorMessage, '공지사항 수정 오류')
					}
				}
			},
			[id, updateNoticeMutation, showError],
		)

		const loading = updateNoticeMutation.isPending

		return (
			<>
				<div
					className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-4 sm:mb-6"
					data-testid="notice-edit-form"
				>
					{/* 헤더 */}
					<div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8">
						<div className="flex items-center">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
								<span
									className="text-2xl sm:text-3xl text-white"
									role="img"
									aria-label="수정"
								>
									✏️
								</span>
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									공지사항 수정
								</h2>
								<p className="text-emerald-100 text-sm sm:text-base">
									내용을 업데이트해보세요
								</p>
							</div>
						</div>
					</div>

					{/* 폼 */}
					<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
						<div className="space-y-6">
							{/* 제목 입력 */}
							<div>
								<label
									htmlFor="edit-title"
									className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									📝 제목
								</label>
								<div className="relative">
									<Input
										id="edit-title"
										{...register('title', { required: true })}
										placeholder="공지사항 제목을 입력하세요"
										disabled={loading}
										className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
										data-testid="edit-notice-title-input"
									/>
								</div>
							</div>

							{/* 내용 입력 */}
							<div>
								<label
									htmlFor="edit-content"
									className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									📄 내용
								</label>
								<div className="relative">
									<Textarea
										id="edit-content"
										{...register('content', { required: true })}
										placeholder="공지사항 내용을 자세히 작성해주세요"
										rows={6}
										disabled={loading}
										className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
										data-testid="edit-notice-content-input"
									/>
								</div>
							</div>

							{/* 버튼들 */}
							<div className="flex flex-col sm:flex-row gap-3 pt-4">
								<Button
									type="submit"
									disabled={loading || formState.isSubmitting}
									className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
									data-testid="edit-notice-submit-button"
								>
									{loading ? (
										<>
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
											수정 중...
										</>
									) : (
										<>
											<span className="mr-2" role="img" aria-label="저장">
												💾
											</span>
											수정 완료
										</>
									)}
								</Button>

								<Button
									type="button"
									onClick={onCancel}
									disabled={loading}
									variant="outline"
									className="flex-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-hidden focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
								>
									<span className="mr-2" role="img" aria-label="취소">
										❌
									</span>
									취소
								</Button>
							</div>
						</div>
					</form>
				</div>
			</>
		)
	},
)

NoticeEditForm.displayName = 'NoticeEditForm'

export default NoticeEditForm
