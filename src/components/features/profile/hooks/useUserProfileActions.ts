import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'

export const useUserProfileActions = () => {
	const { data: session } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()
	const utils = trpc.useUtils()

	const getUserProfileQuery = trpc.userProfile.getUserProfile.useQuery

	const getUserProfileStatQuery = trpc.userProfile.getProfileStats.useQuery

	const getUserProfileWithProfessionsQuery =
		trpc.userProfile.getUserProfileWithProfessions.useQuery

	const createUserProfileMutation =
		trpc.userProfile.createUserProfile.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.userProfile.getUserProfile.invalidate(),
					utils.userProfile.getUserProfileWithProfessions.invalidate(),
				])
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '프로필 생성 오류')
			},
		})

	const updateUserProfileMutation =
		trpc.userProfile.updateUserProfile.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.userProfile.getUserProfile.invalidate(),
					utils.userProfile.getUserProfileWithProfessions.invalidate(),
				])
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '프로필 수정 오류')
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
		getUserProfileQuery,
		getUserProfileStatQuery,
		getUserProfileWithProfessionsQuery,
		createUserProfileMutation,
		updateUserProfileMutation,
		checkAuthentication,
	}
}
