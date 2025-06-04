import { memo } from 'react'
import { SITE_INFO } from '@/constants/homepage'

const Footer = memo(() => {
	return (
		<footer className="max-w-5xl mx-auto px-4 sm:px-8 pb-8 sm:pb-12">
			<div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
				<div
					className="text-xl sm:text-2xl mb-3 sm:mb-4"
					role="img"
					aria-label="졸업모자"
				>
					🎓
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
