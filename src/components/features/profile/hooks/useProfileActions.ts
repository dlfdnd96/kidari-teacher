import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'

export const useProfileActions = () => {
	const { data: session, update: updateSession } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()

	const getUserQuery = trpc.user.getUser.useQuery

	const updateUserMutation = trpc.user.updateUser.useMutation({
		onSuccess: async (updatedUser) => {
			await updateSession({
				user: {
					...session?.user,
					name: updatedUser.name,
				},
			})
			router.refresh()
		},
		onError: (error) => {
			handleClientError(error, showError, '유저 수정 오류')
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
		getUserQuery,
		updateUserMutation,
		checkAuthentication,
	}
}
