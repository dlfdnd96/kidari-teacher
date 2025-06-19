'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import { useSession } from 'next-auth/react'
import {
	ERROR_MESSAGES,
	handleClientError,
	isValidationError,
} from '@/utils/error'

import { NoticeFormSchema } from '@/shared/schemas/notice'
import { NoticeFormProps } from '@/types/notice'
import { FileText, Lock, PenLine, Rocket, SquarePen, X } from 'lucide-react'

const NoticeForm = memo(({ onSuccess, isModal = false }: NoticeFormProps) => {
	const { register, handleSubmit, reset, formState } = useForm()
	const { data: session } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const utils = trpc.useUtils()
	const createNoticeMutation = trpc.notice.createNotice.useMutation({
		onSuccess: async () => {
			await utils.notice.getNoticeList.invalidate()
			router.refresh()
			reset()
			onSuccess?.()
		},
		onError: (error) => {
			handleClientError(error, showError, '공지사항 등록 오류')
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
				const validatedData = NoticeFormSchema.parse(data)
				await createNoticeMutation.mutateAsync(validatedData)
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '공지사항 등록 오류')
				}
			}
		},
		[createNoticeMutation, session, showError],
	)

	const loading = createNoticeMutation.isPending

	return (
		<>
			<div
				className={`${
					isModal
						? 'bg-transparent'
						: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12'
				}`}
			>
				{/* 헤더 - 모달이 아닐 때만 표시 */}
				{!isModal && (
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
						<div className="flex items-center">
							<SquarePen className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									새 공지사항 작성
								</h2>
							</div>
						</div>
					</div>
				)}

				{/* 폼 */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-6 sm:p-8"
					data-testid="create-notice-form-modal"
				>
					<div className="space-y-6">
						{/* 제목 입력 */}
						<div>
							<label
								htmlFor="notice-title"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<PenLine className="w-4 h-4 mr-2" />
								<span>제목</span>
							</label>
							<div className="relative">
								<Input
									id="notice-title"
									{...register('title', { required: true })}
									placeholder="공지사항 제목을 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
									data-testid="create-notice-title-input"
								/>
							</div>
						</div>

						{/* 내용 입력 */}
						<div>
							<label
								htmlFor="notice-content"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<FileText className="w-4 h-4 mr-2" />
								<span>내용</span>
							</label>
							<div className="relative">
								<Textarea
									id="notice-content"
									{...register('content', { required: true })}
									placeholder="공지사항 내용을 자세히 작성해주세요"
									rows={6}
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
									data-testid="create-notice-content-input"
								/>
							</div>
						</div>

						{/* 제출 버튼 */}
						<div
							className={`${isModal ? 'flex justify-end gap-3' : 'flex justify-end'} pt-4`}
						>
							{isModal && (
								<Button
									type="button"
									onClick={onSuccess}
									variant="outline"
									disabled={loading}
									className="flex items-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
								>
									<X className="w-4 h-4 mr-1.5" />
									<span>취소</span>
								</Button>
							)}
							<Button
								type="submit"
								disabled={loading || formState.isSubmitting || !session?.user}
								className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
								data-testid="create-submit-notice-button"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
										<span>등록 중...</span>
									</>
								) : !session?.user ? (
									<>
										<Lock className="w-4 h-4 mr-1.5" />
										<span>로그인 필요</span>
									</>
								) : (
									<>
										<Rocket className="w-4 h-4 mr-1.5" />
										<span>등록</span>
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</>
	)
})

NoticeForm.displayName = 'NoticeForm'

export default NoticeForm
