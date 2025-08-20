'use client'

import React, {
	type DialogHTMLAttributes,
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const linearDialogVariants = cva([
	'fixed inset-0 z-[9999]',
	'bg-black/50 backdrop-blur-sm',
	'data-[state=open]:animate-in data-[state=closed]:animate-out',
	'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
])

const linearDialogContentVariants = cva(
	[
		'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-h-[90vh] p-4',
		'bg-[#0A0B0D] border border-[#1C1D20] rounded-lg shadow-lg',
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
	],
	{
		variants: {
			size: {
				sm: 'max-w-sm',
				default: 'max-w-md',
				lg: 'max-w-lg',
				xl: 'max-w-xl',
				full: 'max-w-full',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	},
)

export interface LinearDialogProps
	extends Omit<DialogHTMLAttributes<HTMLDivElement>, 'open'>,
		VariantProps<typeof linearDialogContentVariants> {
	isOpen?: boolean
	onClose?: () => void
	children: ReactNode
	closeOnEscape?: boolean
	closeOnOverlayClick?: boolean
}

export interface LinearDialogContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

export interface LinearDialogHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

export interface LinearDialogTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
}

export interface LinearDialogDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode
}

export interface LinearDialogFooterProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode
}

export interface LinearDialogCloseButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string
}

const LinearDialog = forwardRef<HTMLDivElement, LinearDialogProps>(
	(
		{
			className,
			size,
			isOpen = false,
			onClose,
			children,
			closeOnEscape = true,
			closeOnOverlayClick = true,
			...props
		},
		ref,
	) => {
		const handleOverlayClick = useCallback(() => {
			if (closeOnOverlayClick && onClose) {
				onClose()
			}
		}, [closeOnOverlayClick, onClose])

		const handleContentClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation()
		}, [])

		useEffect(() => {
			if (!closeOnEscape || !isOpen || !onClose) return

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onClose()
				}
			}

			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}, [closeOnEscape, isOpen, onClose])

		if (!isOpen) {
			return null
		}

		return (
			<div
				className={cn(linearDialogVariants({ className }))}
				data-state={isOpen ? 'open' : 'closed'}
				onClick={handleOverlayClick}
				ref={ref}
				role="dialog"
				aria-modal="true"
				{...props}
			>
				<div
					className={cn(linearDialogContentVariants({ size }))}
					onClick={handleContentClick}
				>
					{children}
				</div>
			</div>
		)
	},
)

const LinearDialogContent = forwardRef<
	HTMLDivElement,
	LinearDialogContentProps
>(({ className, children, ...props }, ref) => (
	<div
		className={cn('flex flex-col overflow-hidden', className)}
		ref={ref}
		{...props}
	>
		{children}
	</div>
))

const LinearDialogHeader = forwardRef<HTMLDivElement, LinearDialogHeaderProps>(
	({ className, children, ...props }, ref) => (
		<div
			className={cn(
				'flex items-center justify-between p-6 border-b border-[#1C1D20] flex-shrink-0',
				className,
			)}
			ref={ref}
			{...props}
		>
			{children}
		</div>
	),
)

const LinearDialogTitle = forwardRef<
	HTMLHeadingElement,
	LinearDialogTitleProps
>(({ className, children, ...props }, ref) => (
	<h2
		className={cn(
			'text-lg font-semibold text-[#F7F8F8] leading-none tracking-tight',
			className,
		)}
		ref={ref}
		{...props}
	>
		{children}
	</h2>
))

const LinearDialogDescription = forwardRef<
	HTMLParagraphElement,
	LinearDialogDescriptionProps
>(({ className, children, ...props }, ref) => (
	<p className={cn('text-sm text-[#8A8F98]', className)} ref={ref} {...props}>
		{children}
	</p>
))

const LinearDialogBody = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div
		className={cn('flex-1 overflow-y-auto p-6 min-h-0', className)}
		ref={ref}
		{...props}
	>
		{children}
	</div>
))

const LinearDialogFooter = forwardRef<HTMLDivElement, LinearDialogFooterProps>(
	({ className, children, ...props }, ref) => (
		<div
			className={cn(
				'flex items-center justify-end gap-3 p-6 border-t border-[#1C1D20] flex-shrink-0',
				className,
			)}
			ref={ref}
			{...props}
		>
			{children}
		</div>
	),
)

const LinearDialogCloseButton = forwardRef<
	HTMLButtonElement,
	LinearDialogCloseButtonProps
>(({ className, onClick, label = '닫기', ...props }, ref) => (
	<button
		type="button"
		className={cn(
			'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity',
			'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2',
			'disabled:pointer-events-none',
			className,
		)}
		onClick={onClick}
		ref={ref}
		aria-label={label}
		{...props}
	>
		<X className="h-4 w-4 text-[#8A8F98]" />
		<span className="sr-only">{label}</span>
	</button>
))

LinearDialog.displayName = 'LinearDialog'
LinearDialogContent.displayName = 'LinearDialogContent'
LinearDialogHeader.displayName = 'LinearDialogHeader'
LinearDialogTitle.displayName = 'LinearDialogTitle'
LinearDialogDescription.displayName = 'LinearDialogDescription'
LinearDialogBody.displayName = 'LinearDialogBody'
LinearDialogFooter.displayName = 'LinearDialogFooter'
LinearDialogCloseButton.displayName = 'LinearDialogCloseButton'

export {
	LinearDialog,
	LinearDialogContent,
	LinearDialogHeader,
	LinearDialogTitle,
	LinearDialogDescription,
	LinearDialogBody,
	LinearDialogFooter,
	LinearDialogCloseButton,
}
