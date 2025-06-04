import { memo } from 'react'
import { ProfessionGroup } from '@/components/ui'
import { PROFESSION_GROUPS } from '@/constants/homepage'

const ProfessionSection = memo(() => {
	return (
		<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					전문직 구성원
				</h2>
				<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
			</div>
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{PROFESSION_GROUPS.map((group, index) => (
						<ProfessionGroup key={index} {...group} />
					))}
				</div>
			</div>
		</section>
	)
})

ProfessionSection.displayName = 'ProfessionSection'

export default ProfessionSection
