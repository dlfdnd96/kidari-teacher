import { memo } from 'react'
import Image from 'next/image'
import { StatCard } from '@/components/ui'
import { HERO_STATS, SITE_INFO } from '@/constants/homepage'

const HeroSection = memo(() => {
	return (
		<section className="relative max-w-4xl mx-auto pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-8 text-center">
			<div className="mb-8">
				<div className="inline-flex items-center justify-center w-80 sm:w-120 h-60 sm:h-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-2xl mb-6 shadow-xl p-4 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
					<Image
						width={1000}
						height={1000}
						src="/images/main/logo.png"
						alt={SITE_INFO.logoAlt}
						className="w-full h-full object-contain"
						priority
					/>
				</div>

				<h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
					{SITE_INFO.title}
				</h1>

				<div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs px-3 sm:px-4 py-2 rounded-full shadow-md mb-3 sm:mb-4">
					<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
						{SITE_INFO.subtitle}
					</span>
				</div>

				<p className="text-lg sm:text-xl mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 font-medium px-2">
					{SITE_INFO.mainDescription}
				</p>

				<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
					{SITE_INFO.description}
				</p>
			</div>

			{/* 통계 카드들 */}
			<div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 sm:mt-12">
				{HERO_STATS.map((stat, index) => (
					<StatCard key={index} {...stat} />
				))}
			</div>
		</section>
	)
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
