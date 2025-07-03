import React from 'react'
import { LoadingSpinnerProps } from '@/types/notice'

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 'md',
	text = '로딩 중...',
	className = '',
}) => {
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	}

	return (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<div
				className={`animate-spin rounded-full border-b-2 border-emerald-600 ${sizeClasses[size]} mb-2`}
			/>
			{text && (
				<p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>
			)}
		</div>
	)
}

export default LoadingSpinner
