import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'

export const useNoticeActions = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()
	const utils = trpc.useUtils()

	const createNoticeMutation = trpc.notice.createNotice.useMutation({
		onSuccess: async () => {
			await utils.notice.getNoticeList.invalidate()
			router.refresh()
		},
		onError: (error) => {
			handleClientError(error, showError, '공지사항 등록 오류')
		},
	})

	const updateNoticeMutation = trpc.notice.updateNotice.useMutation({
		onSuccess: async (_, variables) => {
			await Promise.all([
				utils.notice.getNoticeList.invalidate(),
				utils.notice.getNotice.invalidate({ id: variables.id }),
			])
		},
		onError: (error) => {
			handleClientError(error, showError, '공지사항 수정 오류')
		},
	})

	const deleteNoticeMutation = trpc.notice.deleteNotice.useMutation({
		onSuccess: async () => {
			await utils.notice.getNoticeList.invalidate()
			router.push('/notice')
		},
		onError: (error) => {
			handleClientError(error, showError, '공지사항 삭제 오류')
		},
	})

	const navigateToCreate = useCallback(() => {
		router.push('/notice/create')
	}, [router])

	const navigateToEdit = useCallback(
		(noticeId: string) => {
			router.push(`/notice/${noticeId}/edit`)
		},
		[router],
	)

	const navigateToDetail = useCallback(
		(noticeId: string) => {
			router.push(`/notice/${noticeId}`)
		},
		[router],
	)

	const navigateToList = useCallback(() => {
		router.push('/notice')
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
		// Mutations
		createNoticeMutation,
		updateNoticeMutation,
		deleteNoticeMutation,
		// Navigation
		navigateToCreate,
		navigateToEdit,
		navigateToDetail,
		navigateToList,
		goBack,
		// Utils
		checkAuthentication,
		isAuthenticated: !!session?.user,
	}
}
