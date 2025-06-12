import { memo } from 'react'
import { SITE_INFO } from '@/constants/homepage'
import { GraduationCap } from 'lucide-react'

const Footer = memo(() => {
	return (
		<footer className="max-w-5xl mx-auto px-4 sm:px-8 pb-8 sm:pb-12">
			<div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-xs rounded-2xl p-6 sm:p-8">
				<div className="flex justify-center mb-3 sm:mb-4">
					<GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
				</div>
				<div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
					{SITE_INFO.copyright}
				</div>
				<div className="text-gray-500 dark:text-gray-500 text-xs mt-2">
					{SITE_INFO.mission}
				</div>
			</div>
		</footer>
	)
})

Footer.displayName = 'Footer'

export default Footer
