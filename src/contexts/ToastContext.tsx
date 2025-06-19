'use client'

import React, {
	createContext,
	useContext,
	useCallback,
	useRef,
	useEffect,
} from 'react'
import { toast } from 'sonner'
import { AlertTriangle, CheckCircle, Info, Zap, X } from 'lucide-react'
import { ToastContextType, ToastOptions } from '@/types/toast-context'
import { Enum } from '@/enums'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const loginRequiredTriggered = useRef(false)

	const showLoginRequired = useCallback(() => {
		if (loginRequiredTriggered.current) {
			return
		}

		toast.error('로그인이 필요한 페이지입니다', {
			description: '계속하려면 먼저 로그인을 해주세요.',
			duration: 4000,
			position: Enum.ToastPosition['top-center'],
			icon: <AlertTriangle className="w-5 h-5" />,
			onDismiss: () => {
				loginRequiredTriggered.current = false
			},
			cancel: {
				label: <X className="w-4 h-4" />,
				onClick: () => {
					loginRequiredTriggered.current = false
				},
			},
		})
	}, [])

	const showError = useCallback(
		(title: string, description?: string, options?: ToastOptions) => {
			toast.error(title, {
				description,
				duration: options?.duration || 5000,
				position: options?.position || Enum.ToastPosition['bottom-right'],
				icon: <AlertTriangle className="w-5 h-5" />,
				cancel: {
					label: <X className="w-4 h-4" />,
					onClick: () => {},
				},
			})
		},
		[],
	)

	const showSuccess = useCallback(
		(title: string, description?: string, options?: ToastOptions) => {
			toast.success(title, {
				description,
				duration: options?.duration || 4000,
				position: options?.position || Enum.ToastPosition['top-center'],
				icon: <CheckCircle className="w-5 h-5" />,
			})
		},
		[],
	)

	const showWarning = useCallback(
		(title: string, description?: string, options?: ToastOptions) => {
			toast.warning(title, {
				description,
				duration: options?.duration || 4500,
				position: options?.position || Enum.ToastPosition['top-center'],
				icon: <Zap className="w-5 h-5" />,
			})
		},
		[],
	)

	const showInfo = useCallback(
		(title: string, description?: string, options?: ToastOptions) => {
			toast.info(title, {
				description,
				duration: options?.duration || 4000,
				position: options?.position || Enum.ToastPosition['top-center'],
				icon: <Info className="w-5 h-5" />,
			})
		},
		[],
	)

	const triggerLoginRequired = useCallback(() => {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('login_required', 'true')
			window.dispatchEvent(new CustomEvent('loginRequiredTrigger'))
		}
	}, [])

	useEffect(() => {
		const checkLoginRequired = () => {
			if (typeof window !== 'undefined') {
				const loginRequired = sessionStorage.getItem('login_required')
				if (loginRequired === 'true') {
					sessionStorage.removeItem('login_required')
					showLoginRequired()
				}
			}
		}

		checkLoginRequired()

		const handleLoginRequiredTrigger = () => {
			checkLoginRequired()
		}

		window.addEventListener('loginRequiredTrigger', handleLoginRequiredTrigger)

		return () => {
			window.removeEventListener(
				'loginRequiredTrigger',
				handleLoginRequiredTrigger,
			)
		}
	}, [showLoginRequired])

	const value = {
		showLoginRequired,
		showError,
		showSuccess,
		showWarning,
		showInfo,
		triggerLoginRequired,
	}

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
