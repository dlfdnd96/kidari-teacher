import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'

export const useVolunteerActivityActions = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()
	const utils = trpc.useUtils()

	const getVolunteerActivityQuery =
		trpc.volunteerActivity.getVolunteerActivity.useQuery

	const getVolunteerActivityListQuery =
		trpc.volunteerActivity.getVolunteerActivityList.useQuery

	const createVolunteerActivityMutation =
		trpc.volunteerActivity.createVolunteerActivity.useMutation({
			onSuccess: async () => {
				await utils.volunteerActivity.getVolunteerActivityList.invalidate()
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 등록 오류')
			},
		})

	const updateVolunteerActivityMutation =
		trpc.volunteerActivity.updateVolunteerActivity.useMutation({
			onSuccess: async (_, variables) => {
				await Promise.all([
					utils.volunteerActivity.getVolunteerActivityList.invalidate(),
					utils.volunteerActivity.getVolunteerActivity.invalidate({
						id: variables.id,
					}),
				])
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 수정 오류')
			},
		})

	const deleteVolunteerActivityMutation =
		trpc.volunteerActivity.deleteVolunteerActivity.useMutation({
			onSuccess: async () => {
				await utils.volunteerActivity.getVolunteerActivityList.invalidate()
				router.push('/volunteer-activities')
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 삭제 오류')
			},
		})

	const navigateToCreate = useCallback(() => {
		router.push('/volunteer-activities/create')
	}, [router])

	const navigateToEdit = useCallback(
		(activityId: string) => {
			router.push(`/volunteer-activities/${activityId}/edit`)
		},
		[router],
	)

	const navigateToDetail = useCallback(
		(activityId: string) => {
			router.push(`/volunteer-activities/${activityId}`)
		},
		[router],
	)

	const navigateToList = useCallback(() => {
		router.push('/volunteer-activities')
	}, [router])

	const goBack = useCallback(() => {
		router.back()
	}, [router])

	const checkAuthentication = useCallback(() => {
		if (!session?.user) {
			handleClientError(
				CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
				showError,
				'인증 오류',
			)
			return false
		}
		return true
	}, [session?.user, showError])

	return {
		getVolunteerActivityQuery,
		getVolunteerActivityListQuery,
		createVolunteerActivityMutation,
		updateVolunteerActivityMutation,
		deleteVolunteerActivityMutation,
		navigateToCreate,
		navigateToEdit,
		navigateToDetail,
		navigateToList,
		goBack,
		checkAuthentication,
		isAuthenticated: !!session?.user,
	}
}
