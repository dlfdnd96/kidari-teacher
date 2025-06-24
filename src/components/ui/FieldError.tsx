import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import { FieldErrorListProps, FieldErrorProps } from '@/types/ui'

export const FieldError: React.FC<FieldErrorProps> = ({
	error,
	className,
	showIcon = false,
}) => {
	if (!error || error.trim() === '') {
		return null
	}

	return (
		<div
			className={cn(
				'flex items-center mt-2 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200',
				className,
			)}
			role="alert"
			aria-live="polite"
		>
			{showIcon && <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />}
			<span>{error}</span>
		</div>
	)
}

export const FieldErrorList: React.FC<FieldErrorListProps> = ({
	errors,
	className,
	showIcon = false,
}) => {
	if (!errors || errors.length === 0) {
		return null
	}

	if (errors.length === 1) {
		return (
			<FieldError error={errors[0]} className={className} showIcon={showIcon} />
		)
	}

	return (
		<div
			className={cn(
				'mt-2 space-y-1 animate-in slide-in-from-top-1 duration-200',
				className,
			)}
			role="alert"
			aria-live="polite"
		>
			{errors.map((error, index) => (
				<div
					key={index}
					className="flex items-center text-sm text-red-600 dark:text-red-400"
				>
					{showIcon && <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />}
					<span>{error}</span>
				</div>
			))}
		</div>
	)
}

export default FieldError
