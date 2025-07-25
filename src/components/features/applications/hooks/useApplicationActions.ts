import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'

export const useApplicationActions = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()
	const utils = trpc.useUtils()

	const getApplicationListQuery = trpc.application.getApplicationList.useQuery

	const createApplicationMutation =
		trpc.application.createApplication.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.volunteerActivity.getVolunteerActivityList.invalidate(),
					utils.application.getMyApplicationList.invalidate(),
					utils.application.getApplicationList.invalidate(),
				])
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 지원 등록 오류')
			},
		})

	const cancelApplicationMutation =
		trpc.application.deleteApplication.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.application.getMyApplicationList.invalidate(),
					utils.volunteerActivity.getVolunteerActivityList.invalidate(),
					utils.application.getApplicationList.invalidate(),
				])
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 신청 취소 오류')
			},
		})

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
		getApplicationListQuery,
		createApplicationMutation,
		cancelApplicationMutation,
		checkAuthentication,
	}
}
