import { memo } from 'react'
import { formatDate } from '@/lib/utils'
import {
	RECENT_ACTIVITIES,
	PREFERRED_TIME_SLOTS,
	OTHER_TIME_SLOTS,
} from '@/constants/homepage'

const ActivitySection = memo(() => {
	return (
		<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					2024년 최신 활동 현황
				</h2>
				<div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
				{/* 최근 활동 리스트 */}
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
					<div className="flex items-center mb-4 sm:mb-6">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-linear-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
							<span
								className="text-lg sm:text-xl text-white"
								role="img"
								aria-label="달력"
							>
								📅
							</span>
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
							최근 활동 (2024년)
						</h3>
					</div>

					<ul className="space-y-2 sm:space-y-3">
						{RECENT_ACTIVITIES.map((activity) => (
							<li
								key={`${activity.date}-${activity.school}`}
								className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
							>
								<div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 shrink-0" />
								<div className="flex-1 min-w-0">
									<div className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
										<time dateTime={activity.date}>
											{formatDate(activity.date)}
										</time>
										: {activity.school}
									</div>
									<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
										({activity.location})
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>

				{/* 봉사 가능일 */}
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
					<div className="flex items-center mb-4 sm:mb-6">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-linear-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
							<span
								className="text-lg sm:text-xl text-white"
								role="img"
								aria-label="시계"
							>
								⏰
							</span>
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
							봉사 가능일
						</h3>
					</div>

					{/* 주요 선호 시간 */}
					<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
						<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
							⭐ 주요 선호 시간
						</h4>
						{PREFERRED_TIME_SLOTS.map((slot, index) => (
							<div
								key={`preferred-${index}`}
								className={`flex items-center p-3 sm:p-4 bg-linear-to-r rounded-xl border-2 ${slot.borderColor} ${
									index === 0
										? 'from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600'
										: 'from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600'
								}`}
							>
								<div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 shrink-0">
									<span
										className="text-white font-bold text-sm sm:text-base"
										aria-label="체크"
									>
										✓
									</span>
								</div>
								<div className="flex-1">
									<div className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
										{slot.time}
									</div>
									<div className={`text-xs font-medium ${slot.color}`}>
										주요 선호 시간
									</div>
								</div>
							</div>
						))}
					</div>

					{/* 기타 가능 시간 */}
					<div className="mb-4 sm:mb-6">
						<h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
							기타 가능 시간
						</h4>
						<div className="grid grid-cols-2 gap-2 sm:gap-3">
							{OTHER_TIME_SLOTS.map((slot, index) => (
								<div
									key={`other-${index}`}
									className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
								>
									<div className="w-4 sm:w-5 h-4 sm:h-5 bg-gray-400 rounded-full flex items-center justify-center mr-2 sm:mr-3 shrink-0">
										<span
											className="text-white font-bold text-xs"
											aria-label="원"
										>
											○
										</span>
									</div>
									<div className={`text-xs sm:text-sm ${slot.color}`}>
										{slot.time}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* 안내 메시지 */}
					<div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-400">
						<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
							사회인 봉사 동아리임을 고려하여, 직장인 분들과 학교측의 가능한
							봉사일입니다.
							<span className="font-medium text-yellow-700 dark:text-yellow-300">
								{' '}
								금요일 저녁과 토요일 오전이 가장 선호되며{' '}
							</span>
							다른 시간대도 조율 가능합니다.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
})

ActivitySection.displayName = 'ActivitySection'

export default ActivitySection
