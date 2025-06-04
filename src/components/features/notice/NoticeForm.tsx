'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ErrorModal from '@/components/common/ErrorModal'
import { useRouter } from 'next/navigation'
import { NoticeFormSchema } from '@/components/features/notice/schema'

interface NoticeFormProps {
	onSuccess?: () => void
	isModal?: boolean
}

const NoticeForm = memo(({ onSuccess, isModal = false }: NoticeFormProps) => {
	const { register, handleSubmit, reset, formState } = useForm()
	const [loading, setLoading] = React.useState(false)
	const [errorModalOpen, setErrorModalOpen] = React.useState(false)
	const [errorMessage, setErrorMessage] = React.useState('')
	const router = useRouter()

	const onSubmit = useCallback(
		async (data: unknown) => {
			setLoading(true)
			setErrorModalOpen(false)
			try {
				throw new Error('test')
				const res = await fetch('/api/notice', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(NoticeFormSchema.parse(data)),
				})
				const result = await res.json()
				if (!res.ok) {
					throw new Error(result.error || '등록을 실패했습니다.')
				}

				reset()
				router.refresh()
				onSuccess?.()
			} catch (e: any) {
				setErrorMessage(e.message)
				setErrorModalOpen(true)
			} finally {
				setLoading(false)
			}
		},
		[reset, router, onSuccess],
	)

	const handleErrorClose = useCallback(() => {
		setErrorModalOpen(false)
		setErrorMessage('')
	}, [])

	return (
		<>
			<div
				className={`${
					isModal
						? 'bg-transparent'
						: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12'
				}`}
			>
				{/* 헤더 - 모달이 아닐 때만 표시 */}
				{!isModal && (
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
						<div className="flex items-center">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
								<span
									className="text-2xl sm:text-3xl text-white"
									role="img"
									aria-label="새 공지사항"
								>
									✍️
								</span>
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									새 공지사항 작성
								</h2>
								<p className="text-blue-100 text-sm sm:text-base">
									중요한 정보를 공유해보세요
								</p>
							</div>
						</div>
					</div>
				)}

				{/* 폼 */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
					<div className="space-y-6">
						{/* 제목 입력 */}
						<div>
							<label
								htmlFor="notice-title"
								className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								📝 제목
							</label>
							<div className="relative">
								<Input
									id="notice-title"
									{...register('title', { required: true })}
									placeholder="공지사항 제목을 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
								/>
							</div>
						</div>

						{/* 내용 입력 */}
						<div>
							<label
								htmlFor="notice-content"
								className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								📄 내용
							</label>
							<div className="relative">
								<Textarea
									id="notice-content"
									{...register('content', { required: true })}
									placeholder="공지사항 내용을 자세히 작성해주세요"
									rows={6}
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
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
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
								>
									<span className="mr-2" role="img" aria-label="취소">
										❌
									</span>
									취소
								</Button>
							)}
							<Button
								type="submit"
								disabled={loading || formState.isSubmitting}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
										등록 중...
									</>
								) : (
									<>
										<span className="mr-2" role="img" aria-label="발행">
											🚀
										</span>
										공지사항 등록
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>

			{/* 에러 모달 */}
			<ErrorModal
				open={errorModalOpen}
				onClose={handleErrorClose}
				message={errorMessage}
			/>
		</>
	)
})

NoticeForm.displayName = 'NoticeForm'

export default NoticeForm
