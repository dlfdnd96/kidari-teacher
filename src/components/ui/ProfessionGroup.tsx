import { memo } from 'react'
import { cn } from '@/lib/utils'
import { ExtendedProfessionGroupProps } from '@/types/ui'

const ProfessionGroup = memo<ExtendedProfessionGroupProps>(
	({ icon, title, description, gradient, className }) => {
		return (
			<div className={cn('text-center group', className)}>
				<div
					className={cn(
						'w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300',
						gradient,
					)}
				>
					<span
						className="text-xl sm:text-2xl text-white"
						role="img"
						aria-label={title}
					>
						{icon}
					</span>
				</div>
				<div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
					{title}
				</div>
				<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
					{description}
				</div>
			</div>
		)
	},
)

ProfessionGroup.displayName = 'ProfessionGroup'

export default ProfessionGroup
