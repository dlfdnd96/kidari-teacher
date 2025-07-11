import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VolunteerActivityFormSchema } from '@/shared/schemas/volunteer-activity'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError, isValidationError } from '@/utils/error'
import { UseVolunteerActivityFormProps } from '@/types/volunteer-activity'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from '@/shared/types'

export const useVolunteerActivityForm = ({
	activity,
	onSuccess,
	onSubmit,
}: UseVolunteerActivityFormProps) => {
	const { showError } = useErrorModal()

	const form = useForm({
		resolver: zodResolver(VolunteerActivityFormSchema),
	})

	useEffect(() => {
		if (activity) {
			form.reset({
				title: activity.title,
				description: activity.description,
				startAt: activity.startAt,
				endAt: activity.endAt,
				location: activity.location,
				status: activity.status,
				applicationDeadline: activity.applicationDeadline,
				maxParticipants: activity.maxParticipants,
			})
		}
	}, [activity, form])

	const handleSubmit = useCallback(
		async (data: ZodType<typeof VolunteerActivityFormSchema>) => {
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
