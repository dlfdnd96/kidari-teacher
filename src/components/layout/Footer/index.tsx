import { memo } from 'react'
import Link from 'next/link'
import { GraduationCap, Shield } from 'lucide-react'

const Footer = memo(() => {
	return (
		<footer className="max-w-5xl mx-auto px-4 sm:px-8 pb-8 sm:pb-12">
			<div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-xs rounded-2xl p-6 sm:p-8">
				<div className="flex justify-center mb-3 sm:mb-4">
					<GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
				</div>

				{/* Links */}
				<div className="flex justify-center items-center gap-4 mb-4">
					<Link
						href="/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
					>
						<Shield className="w-4 h-4 mr-1" />
						개인정보 처리방침
					</Link>
				</div>

				<div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
					temp
				</div>
				<div className="text-gray-500 dark:text-gray-500 text-xs mt-2">
					temp
				</div>
			</div>
		</footer>
	)
})

Footer.displayName = 'Footer'

export default Footer
