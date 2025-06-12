import { memo } from 'react'
import { FeedbackCard } from '@/components/ui'
import { SCHOOL_FEEDBACKS } from '@/constants/homepage'
import { MessageCircle } from 'lucide-react'

const FeedbackSection = memo(() => {
	return (
		<section className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					학교 측 반응
				</h2>
				<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
			</div>

			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
				<div className="flex justify-center mb-4 sm:mb-6">
					<MessageCircle className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" />
				</div>

				<div className="space-y-4 sm:space-y-6">
					{SCHOOL_FEEDBACKS.map((feedback, index) => (
						<FeedbackCard key={index} {...feedback} />
					))}
				</div>
			</div>
		</section>
	)
})

FeedbackSection.displayName = 'FeedbackSection'

export default FeedbackSection
