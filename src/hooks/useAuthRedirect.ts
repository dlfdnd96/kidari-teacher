import { useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'

export function useAuthRedirect() {
	const { showLoginRequired, showError, showWarning } = useToast()

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)

		if (urlParams.has('auth_trigger')) {
			const triggerType = urlParams.get('auth_trigger')

			urlParams.delete('auth_trigger')
			const roleParam = urlParams.get('role')
			urlParams.delete('role')

			const newUrl =
				window.location.pathname +
				(urlParams.toString() ? '?' + urlParams.toString() : '')
			window.history.replaceState({}, '', newUrl)

			switch (triggerType) {
				case 'login_required':
					showLoginRequired()
					break

				case 'admin_required':
					showError(
						'관리자 권한이 필요합니다',
						'접근 권한이 없는 페이지입니다.',
					)
					break

				case 'role_required':
					showWarning(
						'권한이 부족합니다',
						roleParam
							? `${roleParam} 권한이 필요합니다.`
							: '접근 권한이 없습니다.',
					)
					break

				default:
					showError('접근 오류', '페이지에 접근할 수 없습니다.')
			}
		}
	}, [showLoginRequired, showError, showWarning])
}

export function useLoginAlert() {
	const { showLoginRequired, showError, showSuccess, showWarning, showInfo } =
		useToast()

	return {
		showLoginRequired,
		showError,
		showSuccess,
		showWarning,
		showInfo,
	}
}
