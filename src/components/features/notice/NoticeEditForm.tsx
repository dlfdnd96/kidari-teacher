'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { NoticeEditFormSchema } from '@/components/features/notice/schema'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'

interface NoticeEditFormProps {
	id: string
	initialTitle: string
	initialContent: string
	onCancel: () => void
}

const NoticeEditForm = memo(
	({ id, initialTitle, initialContent, onCancel }: NoticeEditFormProps) => {
		const { register, handleSubmit, formState } = useForm({
			defaultValues: { title: initialTitle, content: initialContent },
		})
		const [loading, setLoading] = React.useState(false)
		const router = useRouter()
		const { showError } = useErrorModal()

		const onSubmit = useCallback(
			async (data: unknown) => {
				setLoading(true)
				try {
					const res = await fetch(`/api/notice/${id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(NoticeEditFormSchema.parse(data)),
					})
					const result = await res.json()
					if (!res.ok) {
						throw new Error(result.error || '수정을 실패했습니다.')
					}

					router.refresh()
					onCancel()
				} catch (e: any) {
					showError(e.message, '공지사항 수정 오류')
				} finally {
					setLoading(false)
				}
			},
			[id, router, onCancel, showError],
		)

		return (
			<>
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-4 sm:mb-6">
					{/* 헤더 */}
					<div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8">
						<div className="flex items-center">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 sm:mr-6">
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
										className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
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
										className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
									/>
								</div>
							</div>

							{/* 버튼들 */}
							<div className="flex flex-col sm:flex-row gap-3 pt-4">
								<Button
									type="submit"
									disabled={loading || formState.isSubmitting}
									className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
									className="flex-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
