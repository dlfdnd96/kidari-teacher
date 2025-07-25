'use client'

import React, { memo } from 'react'
import { FileText, Send, Type, X } from 'lucide-react'
import { Button, FieldError, Input, Textarea } from '@/components/ui'
import {
	NoticeFormActionsProps,
	NoticeFormFieldProps,
	NoticeFormHeaderProps,
	NoticeFormProps,
} from '@/types/notice'
import {
	useNoticeActions,
	useNoticeForm,
} from '@/components/features/notice/hooks'

const NoticeFormHeader = memo(
	({ title, description }: NoticeFormHeaderProps) => (
		<div className="mb-8">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
						{title}
					</h1>
					{description && (
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							{description}
						</p>
					)}
				</div>
			</div>
			<div
				className="border-b border-gray-200 dark:border-gray-700"
				aria-hidden="true"
			/>
		</div>
	),
)

NoticeFormHeader.displayName = 'NoticeFormHeader'

const NoticeFormField = memo(
	({
		id,
		label,
		placeholder,
		icon,
		required = false,
		error,
		disabled = false,
		type = 'input',
		rows = 12,
		register,
		dataCy,
	}: NoticeFormFieldProps) => (
		<div className="flex items-start gap-3">
			<div
				className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0"
				aria-hidden="true"
			>
				{icon}
			</div>
			<div className="flex-1">
				<label
					htmlFor={id}
					className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
				>
					{label}{' '}
					{required && (
						<span className="text-red-500" aria-label="필수">
							*
						</span>
					)}
				</label>
				{type === 'input' ? (
					<Input
						id={id}
						{...register}
						placeholder={placeholder}
						disabled={disabled}
						className="w-full h-12"
						data-cy={dataCy}
						aria-invalid={error ? 'true' : 'false'}
						aria-describedby={error ? `${id}-error` : undefined}
					/>
				) : (
					<Textarea
						id={id}
						{...register}
						placeholder={placeholder}
						rows={rows}
						disabled={disabled}
						className="w-full resize-none"
						data-cy={dataCy}
						aria-invalid={error ? 'true' : 'false'}
						aria-describedby={error ? `${id}-error` : undefined}
					/>
				)}
				{error && (
					<div id={`${id}-error`} role="alert" aria-live="polite">
						<FieldError error={error} />
					</div>
				)}
			</div>
		</div>
	),
)

NoticeFormField.displayName = 'NoticeFormField'

const NoticeFormActions = memo(
	({
		loading,
		onCancel,
		isEdit = false,
		submitDataCy = 'notice-form-submit-button',
		cancelDataCy = 'notice-form-cancel-button',
	}: NoticeFormActionsProps) => (
		<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
			<div
				className="flex justify-center gap-4"
				role="group"
				aria-label="폼 액션"
			>
				<Button
					type="submit"
					disabled={loading}
					variant="outline"
					className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
					data-cy={submitDataCy}
					aria-describedby={loading ? 'submit-status' : undefined}
				>
					{loading ? (
						<>
							<div
								className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"
								aria-hidden="true"
							/>
							<span id="submit-status">
								{isEdit ? '수정 중...' : '게시 중...'}
							</span>
						</>
					) : (
						<>
							<Send className="w-4 h-4" aria-hidden="true" />
							<span>{isEdit ? '수정하기' : '게시하기'}</span>
						</>
					)}
				</Button>
				<Button
					type="button"
					onClick={onCancel}
					variant="outline"
					disabled={loading}
					className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
					data-cy={cancelDataCy}
				>
					<X className="w-4 h-4" aria-hidden="true" />
					<span>취소</span>
				</Button>
			</div>
		</div>
	),
)

NoticeFormActions.displayName = 'NoticeFormActions'

// 메인 컴포넌트
const NoticeForm = memo(
	({ onSubmit, onSuccess, onCancel, notice }: NoticeFormProps) => {
		const { createNoticeMutation, updateNoticeMutation } = useNoticeActions()

		const {
			register,
			handleSubmit: handleFormSubmit,
			formState: { errors },
		} = useNoticeForm({ onSubmit, onSuccess, notice })

		const loading = notice
			? updateNoticeMutation.isPending
			: createNoticeMutation.isPending

		const isEdit = Boolean(notice)

		return (
			<div className="min-h-screen">
				{/* 메인 컨텐츠 */}
				<main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
					<div className="p-6 sm:p-8">
						<NoticeFormHeader
							title={isEdit ? '공지사항 수정' : '새 공지사항 작성'}
							description={
								isEdit
									? '기존 공지사항을 수정합니다.'
									: '새로운 공지사항을 작성합니다.'
							}
						/>

						<form
							onSubmit={handleFormSubmit}
							className="space-y-8"
							data-cy="notice-form"
							noValidate
						>
							<fieldset disabled={loading} className="space-y-6">
								<legend className="sr-only">공지사항 정보</legend>

								<NoticeFormField
									id="notice-title"
									label="제목"
									placeholder="공지사항 제목을 입력하세요"
									icon={<Type className="h-5 w-5" />}
									register={register('title')}
									required
									error={errors.title?.message}
									disabled={loading}
									dataCy="notice-form-title-input"
								/>

								<NoticeFormField
									id="notice-content"
									label="내용"
									placeholder="공지사항 내용을 작성하세요..."
									icon={<FileText className="h-5 w-5" />}
									register={register('content')}
									required
									error={errors.content?.message}
									disabled={loading}
									type="textarea"
									rows={12}
									dataCy="notice-form-content-input"
								/>
							</fieldset>

							<NoticeFormActions
								loading={loading}
								onCancel={onCancel}
								isEdit={isEdit}
							/>
						</form>
					</div>
				</main>
			</div>
		)
	},
)

NoticeForm.displayName = 'NoticeForm'

export default NoticeForm
