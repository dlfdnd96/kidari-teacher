import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError, isValidationError } from '@/utils/error'
import { ZodType } from '@/shared/types'
import { UseApplicationFormProps } from '@/types/application'
import { ApplicationFormSchema } from '@/shared/schemas/application'

export const useApplicationForm = ({
	onSuccess,
	onSubmit,
}: UseApplicationFormProps) => {
	const { showError } = useErrorModal()

	const form = useForm({
		resolver: zodResolver(ApplicationFormSchema),
	})

	const handleSubmit = useCallback(
		async (data: ZodType<typeof ApplicationFormSchema>) => {
			try {
				await onSubmit(data)
				form.reset()
				onSuccess()
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '처리 중 오류가 발생했습니다')
				}
			}
		},
		[form, onSubmit, onSuccess, showError],
	)

	return {
		...form,
		handleSubmit: form.handleSubmit(handleSubmit),
	}
}
