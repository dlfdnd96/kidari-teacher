import React from 'react'
import { Button } from '@/components/ui'
import { OctagonX, RefreshCw } from 'lucide-react'
import { ErrorStateProps } from '@/types/notice'

const ErrorState: React.FC<ErrorStateProps> = ({
	title = '오류가 발생했습니다',
	message = '잠시 후 다시 시도해주세요.',
	onRetry,
	className = '',
}) => {
	return (
		<div className={`text-center py-12 ${className}`}>
			<div className="flex justify-center mb-6">
				<OctagonX className="w-16 h-16 text-red-400 dark:text-red-500" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
				{title}
			</h3>
			<p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
			{onRetry && (
				<Button
					onClick={onRetry}
					className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
				>
					<RefreshCw className="w-4 h-4" />
					<span>다시 시도</span>
				</Button>
			)}
		</div>
	)
}

export default ErrorState
