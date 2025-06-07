export interface ErrorModalProps {
	open: boolean
	onClose: () => void
	title?: string
	message: string
}

export interface ErrorModalContextType {
	showError: (message: string, title?: string) => void
	hideError: () => void
}
