import { memo } from 'react'
import { cn } from '@/lib/utils'
import { ExtendedFeedbackProps } from '@/types/ui'

const FeedbackCard = memo<ExtendedFeedbackProps>(
	({ content, borderColor, quoteColor, bgGradient, className }) => {
		return (
			<div
				className={cn(
					'relative bg-gradient-to-r p-4 sm:p-6 rounded-2xl border-l-4',
					bgGradient,
					borderColor,
					className,
				)}
			>
				<div
					className={cn(
						'text-xl sm:text-2xl absolute -top-1 sm:-top-2 -left-1 sm:-left-2',
						quoteColor,
					)}
				>
					{'"'}
				</div>
				<p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 italic leading-relaxed">
					{content}
				</p>
			</div>
		)
	},
)

FeedbackCard.displayName = 'FeedbackCard'

export default FeedbackCard
