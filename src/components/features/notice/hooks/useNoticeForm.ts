import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { NoticeFormSchema, NoticeEditFormSchema } from '@/shared/schemas/notice'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError, isValidationError } from '@/utils/error'
import { UseNoticeFormProps } from '@/types/notice'

export const useNoticeForm = ({
	initialTitle = '',
	initialContent = '',
	onSuccess,
	onSubmit,
}: UseNoticeFormProps) => {
	const { showError } = useErrorModal()

	const form = useForm({
		defaultValues: {
			title: initialTitle,
			content: initialContent,
		},
	})

	const handleSubmit = useCallback(
		async (data: unknown) => {
			try {
				const schema = initialTitle ? NoticeEditFormSchema : NoticeFormSchema
				const validatedData = schema.parse(data)
				await onSubmit(validatedData)
				form.reset()
				onSuccess?.()
			} catch (error: unknown) {
				if (isValidationError(error)) {
					handleClientError(error, showError, '입력 검증 오류')
				} else {
					handleClientError(error, showError, '처리 중 오류가 발생했습니다')
				}
			}
		},
		[form, onSubmit, onSuccess, showError, initialTitle],
	)

	return {
		...form,
		handleSubmit: form.handleSubmit(handleSubmit),
	}
}
