import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfileFormSchema } from '@/shared/schemas/user-profile'
import { handleClientError, isValidationError } from '@/utils/error'
import { ZodType } from '@/shared/types'
import { UseUserProfileFormProps } from '@/types/user-profile'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'

export function useUserProfileForm({
	onSubmit,
	onCancel,
	userProfile,
}: UseUserProfileFormProps) {
	const { showError } = useErrorModal()

	const form = useForm({
		resolver: zodResolver(UserProfileFormSchema),
	})

	useEffect(() => {
		if (userProfile) {
			form.reset({
				phone: userProfile.phone,
				professions: userProfile.professions,
				birthDate: userProfile.birthDate,
				organization: userProfile.organization,
			})
		}
	}, [form, userProfile])

	const handleSubmit = useCallback(
		async (data: ZodType<typeof UserProfileFormSchema>) => {
			try {
				await onSubmit(data)
				form.reset()
				onCancel()
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '처리 중 오류가 발생했습니다')
				}
			}
		},
		[form, onSubmit, onCancel, showError],
	)

	return {
		...form,
		handleSubmit: form.handleSubmit(handleSubmit),
	}
}
