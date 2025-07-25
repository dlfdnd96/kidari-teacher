import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NoticeFormSchema } from '@/shared/schemas/notice'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError, isValidationError } from '@/utils/error'
import { UseNoticeFormProps } from '@/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from '@/shared/types'

export const useNoticeForm = ({
	notice,
	onSubmit,
	onSuccess,
}: UseNoticeFormProps) => {
	const { showError } = useErrorModal()

	const form = useForm({
		resolver: zodResolver(NoticeFormSchema),
	})

	useEffect(() => {
		if (notice) {
			form.reset({
				title: notice.title,
				content: notice.content,
			})
		}
	}, [notice, form])

	const handleSubmit = useCallback(
		async (data: ZodType<typeof NoticeFormSchema>) => {
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
