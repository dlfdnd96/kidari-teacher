'use client'

import React, {
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const linearModalVariants = cva([
	'fixed inset-0 z-[9999]',
	'bg-black/60 backdrop-blur-md',
	'data-[state=open]:animate-in data-[state=closed]:animate-out',
	'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
	'data-[state=closed]:duration-200 data-[state=open]:duration-200',
])

const linearModalContentVariants = cva(
	[
		'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-h-[90vh] overflow-hidden p-4',
		'bg-[#08090A] border border-[#1C1D20] rounded-xl shadow-2xl',
		'data-[state=open]:animate-[modal-scale-in_200ms_ease-out]',
		'data-[state=closed]:animate-[modal-scale-out_200ms_ease-in]',
	],
	{
		variants: {
			size: {
				sm: 'max-w-sm',
				default: 'max-w-lg',
				lg: 'max-w-2xl',
				xl: 'max-w-4xl',
				full: 'max-w-[95vw] max-h-[95vh]',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	},
)

export interface LinearModalProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'children'>,
		VariantProps<typeof linearModalContentVariants> {
	isOpen?: boolean
	onClose?: () => void
	children: ReactNode
	closeOnOverlayClick?: boolean
	closeOnEscape?: boolean
	initialFocus?: React.RefObject<HTMLElement>
	title?: string
	description?: string
}

export interface LinearModalContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

export interface LinearModalHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

export interface LinearModalTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
}

export interface LinearModalDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode
}

export interface LinearModalFooterProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

const Modal = forwardRef<HTMLDivElement, LinearModalProps>(
	(
		{
			className,
			size,
			isOpen = false,
			onClose,
			children,
			closeOnOverlayClick = true,
			closeOnEscape = true,
			initialFocus,
			title,
			description,
			...props
		},
		ref,
	) => {
		const modalId = useId()
		const titleId = `${modalId}-title`
		const descriptionId = `${modalId}-description`
		const previousBodyOverflow = useRef<string>('')
		const previousActiveElement = useRef<Element | null>(null)

		const handleEscape = useCallback(
			(event: KeyboardEvent) => {
				if (event.key === 'Escape' && closeOnEscape && onClose) {
					event.preventDefault()
					onClose()
				}
			},
			[closeOnEscape, onClose],
		)

		const handleOverlayClick = useCallback(
			(e: React.MouseEvent) => {
				if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
					onClose()
				}
			},
			[closeOnOverlayClick, onClose],
		)

		const handleContentClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation()
		}, [])

		useEffect(() => {
			if (isOpen) {
				previousActiveElement.current = document.activeElement
				previousBodyOverflow.current = document.body.style.overflow
				document.body.style.overflow = 'hidden'
				document.addEventListener('keydown', handleEscape)

				setTimeout(() => {
					if (initialFocus?.current) {
						initialFocus.current.focus()
					} else {
						const firstFocusable = document.querySelector(
							'[data-modal-content] button, [data-modal-content] [href], [data-modal-content] input, [data-modal-content] select, [data-modal-content] textarea, [data-modal-content] [tabindex]:not([tabindex="-1"])',
						) as HTMLElement
						firstFocusable?.focus()
					}
				}, 100)
			} else {
				document.removeEventListener('keydown', handleEscape)
				if (previousBodyOverflow.current !== undefined) {
					document.body.style.overflow = previousBodyOverflow.current
				} else {
					document.body.style.removeProperty('overflow')
				}
				if (previousActiveElement.current instanceof HTMLElement) {
					previousActiveElement.current.focus()
				}
			}

			return () => {
				document.removeEventListener('keydown', handleEscape)
				if (previousBodyOverflow.current !== undefined) {
					document.body.style.overflow = previousBodyOverflow.current
				} else {
					document.body.style.removeProperty('overflow')
				}
			}
		}, [isOpen, handleEscape, initialFocus])

		if (!isOpen) {
			return null
		}

		return (
			<div
				className={cn(linearModalVariants({ className }))}
				data-state={isOpen ? 'open' : 'closed'}
				onClick={handleOverlayClick}
				ref={ref}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				aria-describedby={description ? descriptionId : undefined}
				{...props}
			>
				<div
					className={cn(linearModalContentVariants({ size }))}
					data-state={isOpen ? 'open' : 'closed'}
					data-modal-content
					onClick={handleContentClick}
				>
					{children}
				</div>
			</div>
		)
	},
)

const LinearModalContent = forwardRef<HTMLDivElement, LinearModalContentProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				className={cn('flex flex-col h-full', className)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	},
)

const LinearModalHeader = forwardRef<HTMLDivElement, LinearModalHeaderProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex items-center justify-between p-6 border-b border-[#1C1D20] bg-[#0A0B0D]/50',
					className,
				)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	},
)

const LinearModalTitle = forwardRef<HTMLHeadingElement, LinearModalTitleProps>(
	({ className, children, id, ...props }, ref) => {
		return (
			<h2
				className={cn(
					'text-xl font-semibold text-[#F7F8F8] leading-none tracking-tight',
					className,
				)}
				id={id}
				ref={ref}
				{...props}
			>
				{children}
			</h2>
		)
	},
)

const LinearModalDescription = forwardRef<
	HTMLParagraphElement,
	LinearModalDescriptionProps
>(({ className, children, id, ...props }, ref) => {
	return (
		<p
			className={cn('text-sm text-[#8A8F98] mt-1', className)}
			id={id}
			ref={ref}
			{...props}
		>
			{children}
		</p>
	)
})

const LinearModalBody = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<div
			className={cn('flex-1 overflow-y-auto p-6', className)}
			ref={ref}
			{...props}
		>
			{children}
		</div>
	)
})

const LinearModalFooter = forwardRef<HTMLDivElement, LinearModalFooterProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex items-center justify-end gap-3 p-6 border-t border-[#1C1D20] bg-[#0A0B0D]/50',
					className,
				)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	},
)

const LinearModalCloseButton = forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
	return (
		<button
			type="button"
			className={cn(
				'absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity',
				'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2',
				'disabled:pointer-events-none p-1',
				className,
			)}
			onClick={onClick}
			ref={ref}
			aria-label="Close modal"
			{...props}
		>
			<X className="h-5 w-5 text-[#8A8F98]" aria-hidden="true" />
			<span className="sr-only">Close</span>
		</button>
	)
})

Modal.displayName = 'Modal'
LinearModalContent.displayName = 'LinearModalContent'
LinearModalHeader.displayName = 'LinearModalHeader'
LinearModalTitle.displayName = 'LinearModalTitle'
LinearModalDescription.displayName = 'LinearModalDescription'
LinearModalBody.displayName = 'LinearModalBody'
LinearModalFooter.displayName = 'LinearModalFooter'
LinearModalCloseButton.displayName = 'LinearModalCloseButton'

export {
	Modal,
	LinearModalContent,
	LinearModalHeader,
	LinearModalTitle,
	LinearModalDescription,
	LinearModalBody,
	LinearModalFooter,
	LinearModalCloseButton,
}
