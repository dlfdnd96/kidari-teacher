'use client'

import { type ButtonHTMLAttributes, forwardRef, memo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linearButtonVariants = cva(
	[
		'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none',
		'transition-all duration-150 ease-out active:scale-95',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
		'disabled:pointer-events-none disabled:opacity-50',
		'[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	],
	{
		variants: {
			variant: {
				primary: [
					'bg-[#E6E6E6] text-[#08090A] border border-[#E6E6E6]',
					'hover:bg-white hover:text-black',
				],
				secondary: [
					'bg-transparent text-[#8A8F98] border border-transparent',
					'hover:bg-white/5 hover:text-[#F7F8F8]',
				],
				ghost: [
					'bg-transparent text-[#F7F8F8] border border-transparent',
					'hover:bg-white/8 hover:text-white',
				],
				success: [
					'bg-[#4CAF50] text-white border border-[#4CAF50]',
					'hover:bg-[#45A049]',
				],
				warning: [
					'bg-[#FF9800] text-white border border-[#FF9800]',
					'hover:bg-[#F57C00]',
				],
				error: [
					'bg-[#F44336] text-white border border-[#F44336]',
					'hover:bg-[#E53935]',
				],
				info: [
					'bg-[#2196F3] text-white border border-[#2196F3]',
					'hover:bg-[#1976D2]',
				],
			},
			size: {
				sm: 'h-7 px-2 text-xs rounded-md',
				default: 'h-8 px-3 text-[13px] rounded-lg',
				lg: 'h-10 px-4 text-sm rounded-lg',
				icon: 'h-8 w-8 rounded-lg',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default',
		},
	},
)

export interface LinearButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof linearButtonVariants> {
	loading?: boolean
	loadingText?: string
}

const LinearButton = forwardRef<HTMLButtonElement, LinearButtonProps>(
	(
		{
			className,
			variant,
			size,
			loading = false,
			loadingText = 'Loading...',
			disabled,
			children,
			...props
		},
		ref,
	) => {
		return (
			<button
				className={cn(linearButtonVariants({ variant, size, className }))}
				disabled={disabled || loading}
				ref={ref}
				{...props}
			>
				{loading ? (
					<>
						<LoadingSpinner size={size ?? undefined} />
						<span className="sr-only">Loading</span>
						{loadingText}
					</>
				) : (
					children
				)}
			</button>
		)
	},
)

const LoadingSpinner = memo<{ size?: 'sm' | 'default' | 'lg' | 'icon' }>(
	({ size = 'default' }) => {
		const spinnerSize = {
			sm: 'h-3 w-3',
			default: 'h-4 w-4',
			lg: 'h-4 w-4',
			icon: 'h-4 w-4',
		}[size]

		const marginClass = {
			sm: '-ml-0.5 mr-1.5',
			default: '-ml-1 mr-2',
			lg: '-ml-1 mr-2',
			icon: '',
		}[size]

		return (
			<svg
				className={cn('animate-spin', spinnerSize, marginClass)}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		)
	},
)

LoadingSpinner.displayName = 'LoadingSpinner'
LinearButton.displayName = 'LinearButton'

export { LinearButton, linearButtonVariants }
