import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'

type ToastPosition = ZodType<typeof ZodEnum.ToastPosition>

export interface ToastOptions {
	position?: ToastPosition
	duration?: number
}

export interface ToastContextType {
	showLoginRequired: () => void
	showError: (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => void
	showSuccess: (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => void
	showWarning: (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => void
	showInfo: (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => void
	triggerLoginRequired: () => void
}
