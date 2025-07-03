import React from 'react'
import { Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import { BackButtonProps } from '@/types/notice'

const BackButton: React.FC<BackButtonProps> = ({
	onClick,
	text = '뒤로가기',
	className = '',
}) => {
	return (
		<Button
			onClick={onClick}
			variant="outline"
			className={`flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer border-0 h-auto ${className}`}
		>
			<ArrowLeft className="w-4 h-4" />
			<span className="text-sm font-medium">{text}</span>
		</Button>
	)
}

export default BackButton
