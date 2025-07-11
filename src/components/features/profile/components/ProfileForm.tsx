'use client'

import React, { memo, useCallback } from 'react'
import { Save, User, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button, FieldError, Input } from '@/components/ui'
import type { ProfileFormProps } from '@/types/profile'
import {
	useProfileForm,
	useProfileActions,
} from '@/components/features/profile/hooks'
import { ZodType } from '@/shared/types'
import { UserFormSchema } from '@/shared/schemas/user'

const LoadingSpinner = memo(() => (
	<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
))

LoadingSpinner.displayName = 'LoadingSpinner'

const FormButton = memo(
	({
		type,
		onClick,
		disabled,
		variant = 'save',
		children,
		dataCy,
	}: {
		type: 'submit' | 'button'
		onClick?: () => void
		disabled?: boolean
		variant?: 'save' | 'cancel'
		children: React.ReactNode
		dataCy?: string
	}) => {
		const baseClasses =
			'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed'

		const variantClasses = {
			save: 'text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600',
			cancel:
				'text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600',
		}

		return (
			<Button
				type={type}
				onClick={onClick}
				disabled={disabled}
				variant="outline"
				className={`${baseClasses} ${variantClasses[variant]}`}
				data-cy={dataCy}
			>
				{children}
			</Button>
		)
	},
)

FormButton.displayName = 'FormButton'

const FormHeader = memo(() => (
	<div className="border-b border-gray-200 p-6">
		<div className="flex items-center">
			<User className="w-5 h-5 text-gray-500 mr-3" />
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-1">
					프로필 수정
				</h2>
			</div>
		</div>
	</div>
))

FormHeader.displayName = 'FormHeader'

const NameField = memo(
	({
		register,
		error,
		defaultValue,
		disabled,
	}: {
		register: any
		error?: string
		defaultValue?: string | null
		disabled?: boolean
	}) => (
		<div>
			<label
				htmlFor="profile-name"
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				이름 *
			</label>
			<Input
				id="profile-name"
				{...register('name')}
				placeholder="이름을 입력하세요"
				defaultValue={defaultValue ?? ''}
				disabled={disabled}
				className="w-full"
				data-cy="profile-name-input"
			/>
			<FieldError error={error} />
		</div>
	),
)

NameField.displayName = 'NameField'

const FormActions = memo(
	({ loading, onCancel }: { loading: boolean; onCancel: () => void }) => (
		<div className="flex gap-3 pt-4 justify-center">
			<FormButton
				type="submit"
				disabled={loading}
				variant="save"
				dataCy="profile-form-submit"
			>
				{loading ? (
					<>
						<LoadingSpinner />
						<span>저장 중...</span>
					</>
				) : (
					<>
						<Save className="w-4 h-4" />
						<span>수정 완료</span>
					</>
				)}
			</FormButton>

			<FormButton
				type="button"
				onClick={onCancel}
				disabled={loading}
				variant="cancel"
				dataCy="profile-form-cancel"
			>
				<X className="w-4 h-4" />
				<span>취소</span>
			</FormButton>
		</div>
	),
)

FormActions.displayName = 'FormActions'

const ProfileForm = memo(({ onCancel, refetchUser }: ProfileFormProps) => {
	const { data: session } = useSession()

	const { checkAuthentication, updateUserMutation } = useProfileActions()

	const handleSubmit = useCallback(
		async (data: ZodType<typeof UserFormSchema>) => {
			if (!checkAuthentication()) {
				return
			}

			await updateUserMutation.mutateAsync({
				name: data.name,
			})
		},
		[checkAuthentication, updateUserMutation],
	)

	const {
		register,
		handleSubmit: handleFormSubmit,
		formState: { errors },
	} = useProfileForm({ onSubmit: handleSubmit, onCancel, refetchUser })

	const loading = updateUserMutation.isPending

	return (
		<div
			className="bg-white border border-gray-200 rounded-lg"
			data-cy="profile-form"
		>
			<FormHeader />

			<form onSubmit={handleFormSubmit} className="p-6">
				<div className="space-y-6">
					<NameField
						register={register}
						error={errors.name?.message}
						defaultValue={session?.user?.name}
						disabled={loading}
					/>

					<FormActions loading={loading} onCancel={onCancel} />
				</div>
			</form>
		</div>
	)
})

ProfileForm.displayName = 'ProfileForm'

export default ProfileForm
