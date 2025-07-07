'use client'

import React, { memo, useCallback } from 'react'
import { VolunteerActivityForm } from './components'
import { ZodType } from '@/shared/types'
import { VolunteerActivityFormSchema } from '@/shared/schemas/volunteer-activity'
import { useToast } from '@/contexts/ToastContext'
import { useVolunteerActivityActions } from './hooks'

const VolunteerActivityCreatePageClient = memo(() => {
	const { showSuccess } = useToast()

	const {
		createVolunteerActivityMutation,
		navigateToList,
		goBack,
		checkAuthentication,
	} = useVolunteerActivityActions()

	const handleSubmit = useCallback(
		async (data: ZodType<typeof VolunteerActivityFormSchema>) => {
			if (!checkAuthentication()) {
				return
			}

			await createVolunteerActivityMutation.mutateAsync(data)
			showSuccess('봉사활동이 생성되었습니다')
		},
		[checkAuthentication, createVolunteerActivityMutation, showSuccess],
	)

	return (
		<VolunteerActivityForm
			onSubmit={handleSubmit}
			onSuccess={navigateToList}
			onCancel={goBack}
		/>
	)
})

VolunteerActivityCreatePageClient.displayName =
	'VolunteerActivityCreatePageClient'

export default VolunteerActivityCreatePageClient
