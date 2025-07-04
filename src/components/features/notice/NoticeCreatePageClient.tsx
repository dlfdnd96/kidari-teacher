'use client'

import React, { memo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Input, Textarea } from '@/components/ui'
import { FileText, Type, X, Send } from 'lucide-react'
import { BackButton } from '@/components/common/ui'
import { useNoticeActions, useNoticeForm } from './hooks'

const NoticeCreatePageClient = memo(() => {
	const { data: session } = useSession()
	const { createNoticeMutation, navigateToList, goBack, checkAuthentication } =
		useNoticeActions()

	const handleSubmit = useCallback(
		async (data: { title: string; content: string }) => {
			if (!checkAuthentication()) {
				return
			}

			await createNoticeMutation.mutateAsync(data)
		},
		[createNoticeMutation, checkAuthentication],
	)

	const {
		register,
		handleSubmit: handleFormSubmit,
		formState,
	} = useNoticeForm({
		onSuccess: navigateToList,
		onSubmit: handleSubmit,
	})

	const loading = createNoticeMutation.isPending

	return (
		<div className="min-h-screen">
			{/* 상단 네비게이션 */}
			<div>
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
					<div className="flex items-center justify-between h-14">
						<div className="py-4">
							<BackButton onClick={goBack} />
						</div>
					</div>
				</div>
			</div>

			{/* 메인 컨텐츠 */}
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
				<div className="p-6 sm:p-8">
					{/* 헤더 */}
					<div className="mb-8">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
									새 공지사항 작성
								</h1>
							</div>
						</div>
						<div className="border-b border-gray-200 dark:border-gray-700"></div>
					</div>

					{/* 폼 */}
					<form
						onSubmit={handleFormSubmit}
						className="space-y-8"
						data-cy="create-notice-form-modal"
					>
						{/* 기본 정보 섹션 */}
						<div className="space-y-6">
							{/* 제목 입력 */}
							<div className="flex items-start gap-3">
								<Type className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="notice-title"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										제목 *
									</label>
									<Input
										id="notice-title"
										{...register('title', { required: true })}
										placeholder="공지사항 제목을 입력하세요"
										disabled={loading}
										className="w-full h-12"
										data-cy="create-notice-title-input"
									/>
								</div>
							</div>

							{/* 내용 입력 */}
							<div className="flex items-start gap-3">
								<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="notice-content"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										내용 *
									</label>
									<Textarea
										id="notice-content"
										{...register('content', { required: true })}
										placeholder="공지사항 내용을 작성하세요..."
										rows={12}
										disabled={loading}
										className="w-full resize-none"
										data-cy="create-notice-content-input"
									/>
								</div>
							</div>
						</div>

						{/* 제출 버튼 영역 */}
						<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
							<div className="flex justify-center gap-4">
								<Button
									type="submit"
									disabled={loading || formState.isSubmitting || !session?.user}
									variant="outline"
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
									data-cy="create-submit-notice-button"
								>
									{loading ? (
										<>
											<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
											<span>게시 중...</span>
										</>
									) : (
										<>
											<Send className="w-4 h-4" />
											<span>게시하기</span>
										</>
									)}
								</Button>
								<Button
									type="button"
									onClick={navigateToList}
									variant="outline"
									disabled={loading}
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
								>
									<X className="w-4 h-4" />
									<span>취소</span>
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
})

NoticeCreatePageClient.displayName = 'NoticeCreatePageClient'

export default NoticeCreatePageClient
