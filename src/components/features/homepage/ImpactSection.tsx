import { memo } from 'react'
import { IMPACT_STATS } from '@/constants/homepage'
import { Smile, Users, Target, Star, TrendingUp } from 'lucide-react'

const ImpactSection = memo(() => {
	const icons = [Smile, Users, Target, Star]

	return (
		<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					활동의 임팩트
				</h2>
				<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
					실제 수치로 보는 키다리 선생님의 성과와 학생들의 반응
				</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{IMPACT_STATS.map((stat, index) => {
					const gradientColors = [
						'from-green-400 to-emerald-500',
						'from-blue-400 to-purple-500',
						'from-purple-400 to-pink-500',
						'from-orange-400 to-red-500',
					]
					const IconComponent = icons[index]

					return (
						<div
							key={index}
							className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
						>
							<div
								className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${gradientColors[index]} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
							>
								<IconComponent className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
							</div>
							<div
								className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
							>
								{stat.value}
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
								{stat.label}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
								{stat.description}
							</div>
						</div>
					)
				})}
			</div>

			{/* 추가 설명 */}
			<div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-gray-600">
				<div className="text-center">
					<div className="flex items-center justify-center mb-3">
						<TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
						<span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
							지속적인 성장과 발전
						</span>
					</div>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
						2022년 시작된 키다리 선생님은 매년 더 많은 학교와 학생들에게 양질의
						진로 교육을 제공하고 있습니다. 참여하신 전문직 분들의 진심어린
						조언과 학생들의 열정적인 참여가 만들어낸 의미있는 성과입니다.
					</p>
				</div>
			</div>
		</section>
	)
})

ImpactSection.displayName = 'ImpactSection'

export default ImpactSection
