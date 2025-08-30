'use client'

import React, {
	forwardRef,
	type InputHTMLAttributes,
	type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const baseInputStyles = [
	'flex w-full rounded-lg border px-3 py-2 text-sm',
	'bg-white/5 border-white/8 text-[#F7F8F8] placeholder:text-[#8A8F98]',
	'transition-all duration-150 ease-out',
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20',
	'disabled:cursor-not-allowed disabled:opacity-50',
] as const

const errorStyles =
	'border-[#F44336] focus-visible:border-[#F44336] focus-visible:ring-[#F44336]/20'

export interface LinearInputProps
	extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean
}

export interface LinearTextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean
	resizable?: boolean
	minHeight?: number
}

const Input = forwardRef<HTMLInputElement, LinearInputProps>(
	({ className, type = 'text', error = false, ...props }, ref) => (
		<input
			type={type}
			className={cn(
				baseInputStyles,
				'h-10',
				'file:border-0 file:bg-transparent file:text-sm file:font-medium',
				error && errorStyles,
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
)
Input.displayName = 'Input'

const LinearTextarea = forwardRef<HTMLTextAreaElement, LinearTextareaProps>(
	(
		{ className, error = false, resizable = false, minHeight = 80, ...props },
		ref,
	) => (
		<textarea
			className={cn(
				baseInputStyles,
				`min-h-[${minHeight}px]`,
				resizable ? 'resize-y' : 'resize-none',
				error && errorStyles,
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
)
LinearTextarea.displayName = 'LinearTextarea'

const LinearLabel = forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
	<label
		ref={ref}
		className={cn(
			'text-sm font-medium text-[#F7F8F8] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
			className,
		)}
		{...props}
	/>
))
LinearLabel.displayName = 'LinearLabel'

export { Input, LinearTextarea, LinearLabel }
