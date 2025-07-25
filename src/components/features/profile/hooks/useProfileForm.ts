import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError, isValidationError } from '@/utils/error'
import { UserFormSchema } from '@/shared/schemas/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from '@/shared/types'
import { UseProfileFormProps } from '@/types/profile'

export const useProfileForm = ({
	onSubmit,
	onCancel,
	refetchUser,
}: UseProfileFormProps) => {
	const { showError } = useErrorModal()

	const form = useForm({
		resolver: zodResolver(UserFormSchema),
	})

	const handleSubmit = useCallback(
		async (data: ZodType<typeof UserFormSchema>) => {
			try {
				await onSubmit(data)
				form.reset()
				await refetchUser()
				onCancel()
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '처리 중 오류가 발생했습니다')
				}
			}
		},
		[form, onSubmit, refetchUser, onCancel, showError],
	)

	return {
		...form,
		handleSubmit: form.handleSubmit(handleSubmit),
	}
}
