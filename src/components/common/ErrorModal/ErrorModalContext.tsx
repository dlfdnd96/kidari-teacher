import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'
import ErrorModal from '@/components/common/ErrorModal'
import { ErrorModalContextType } from '@/types/error'

const ErrorModalContext = createContext<ErrorModalContextType | undefined>(
	undefined,
)

export const useErrorModal = () => {
	const context = useContext(ErrorModalContext)
	if (!context) {
		throw new Error('useErrorModal must be used within ErrorModalProvider')
	}

	return context
}

export const ErrorModalProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [title, setTitle] = useState<string | undefined>(undefined)

	const showError = useCallback((msg: string, title?: string) => {
		setMessage(msg)
		setTitle(title)
		setOpen(true)
	}, [])

	const hideError = useCallback(() => {
		setOpen(false)
		setMessage('')
		setTitle(undefined)
	}, [])

	return (
		<ErrorModalContext.Provider value={{ showError, hideError }}>
			{children}
			<ErrorModal
				open={open}
				onClose={hideError}
				title={title}
				message={message}
			/>
		</ErrorModalContext.Provider>
	)
}
