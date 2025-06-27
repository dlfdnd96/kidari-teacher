'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input, Textarea, Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { NoticeEditFormSchema } from '@/shared/schemas/notice'
import { NoticeEditFormProps } from '@/types/notice'
import { ArrowLeft, FileText, Type } from 'lucide-react'
import { useSession } from 'next-auth/react'

const NoticeEditForm = memo(
	({ id, initialTitle, initialContent, onCancel }: NoticeEditFormProps) => {
		const { register, handleSubmit, formState } = useForm({
			defaultValues: { title: initialTitle, content: initialContent },
		})
		const router = useRouter()
		const { data: session } = useSession()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()
		const updateNoticeMutation = trpc.notice.updateNotice.useMutation({
			onSuccess: async () => {
				await utils.notice.getNoticeList.invalidate()
				router.refresh()
				onCancel()
			},
			onError: (error) => {
				handleClientError(error, showError, '공지사항 수정 오류')
			},
		})

		const onSubmit = useCallback(
			async (data: unknown) => {
				if (!session?.user) {
					handleClientError(
						CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
						showError,
						'인증 오류',
					)
					return
				}

				try {
					const validatedData = NoticeEditFormSchema.parse(data)
					await updateNoticeMutation.mutateAsync({
						id,
						title: validatedData.title,
						content: validatedData.content,
					})
				} catch (error: unknown) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(error, showError, '공지사항 수정 오류')
					}
				}
			},
			[session?.user, showError, updateNoticeMutation, id],
		)

		const loading = updateNoticeMutation.isPending

		return (
			<>
				{/* 상단 네비게이션 */}
				<div>
					<div className="flex items-center justify-between h-14">
						<div className="py-4">
							<Button
								onClick={() => router.back()}
								variant="outline"
								className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer border-0 h-auto"
							>
								<ArrowLeft className="w-4 h-4" />
								<span className="text-sm font-medium">뒤로가기</span>
							</Button>
						</div>
					</div>
				</div>

				{/* 메인 컨텐츠 */}
				<div className="py-8">
					<div className="p-6 sm:p-8">
						{/* 헤더 */}
						<div className="mb-8">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 min-w-0">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
										공지사항 수정
									</h1>
								</div>
							</div>
							<div className="border-b border-gray-200 dark:border-gray-700"></div>
						</div>

						{/* 폼 */}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-8"
							data-testid="notice-edit-form"
						>
							{/* 기본 정보 섹션 */}
							<div className="space-y-6">
								{/* 제목 입력 */}
								<div className="flex items-start gap-3">
									<Type className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<label
											htmlFor="edit-title"
											className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
										>
											제목 *
										</label>
										<Input
											id="edit-title"
											{...register('title', { required: true })}
											placeholder="공지사항 제목을 입력하세요"
											disabled={loading}
											className="w-full h-12"
											data-testid="edit-notice-title-input"
										/>
									</div>
								</div>

								{/* 내용 입력 */}
								<div className="flex items-start gap-3">
									<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<label
											htmlFor="edit-content"
											className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
										>
											내용 *
										</label>
										<Textarea
											id="edit-content"
											{...register('content', { required: true })}
											placeholder="공지사항 내용을 작성하세요..."
											rows={12}
											disabled={loading}
											className="w-full resize-none"
											data-testid="edit-notice-content-input"
										/>
									</div>
								</div>
							</div>

							{/* 제출 버튼 영역 */}
							<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
								<div className="flex justify-center gap-4">
									<Button
										type="button"
										onClick={onCancel}
										disabled={loading}
										variant="outline"
										className="px-8 py-3 h-12 cursor-pointer"
									>
										취소
									</Button>
									<Button
										type="submit"
										disabled={loading || formState.isSubmitting}
										className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 h-12 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
										data-testid="edit-notice-submit-button"
									>
										{loading ? (
											<>
												<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
												<span>수정 중...</span>
											</>
										) : (
											<>
												<span>수정하기</span>
											</>
										)}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</>
		)
	},
)

NoticeEditForm.displayName = 'NoticeEditForm'

export default NoticeEditForm
