import { memo } from 'react'
import { cn } from '@/lib/utils'
import { DynamicIcon } from '@/components/utils/IconMapper'

interface ExtendedStatCardProps {
	icon: string
	value: string
	label: string
	description?: string
	gradient: string
	borderColor: string
	className?: string
}

const StatCard = memo<ExtendedStatCardProps>(
	({ icon, value, label, description, gradient, borderColor, className }) => {
		return (
			<div
				className={cn(
					'group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 w-full sm:w-40 transition-all duration-300 hover:-translate-y-2',
					borderColor,
					className,
				)}
			>
				<div
					className={cn(
						'text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2',
						gradient,
					)}
				>
					{value}
				</div>
				<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
					{label}
				</div>
				{description && (
					<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
						{description}
					</div>
				)}
				<div className="flex justify-center mt-2" role="img" aria-label={label}>
					<div
						className={cn(
							'w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r shadow-lg',
							gradient,
						)}
					>
						<DynamicIcon name={icon} className="text-white" size={20} />
					</div>
				</div>
			</div>
		)
	},
)

StatCard.displayName = 'StatCard'

export default StatCard
