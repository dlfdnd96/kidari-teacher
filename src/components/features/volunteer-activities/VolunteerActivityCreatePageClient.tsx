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
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
				<VolunteerActivityForm
					onSubmit={handleSubmit}
					onSuccess={navigateToList}
					onCancel={goBack}
				/>
			</div>
		</div>
	)
})

VolunteerActivityCreatePageClient.displayName =
	'VolunteerActivityCreatePageClient'

export default VolunteerActivityCreatePageClient
