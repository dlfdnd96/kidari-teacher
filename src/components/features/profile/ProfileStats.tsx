'use client'

import React, { memo } from 'react'
import { FileText, CheckCircle, Trophy, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ProfileStatsProps } from '@/types/profile'

const ProfileStats = memo(
	({
		applicationCount,
		participatedCount,
		completedCount,
		memberSince,
	}: ProfileStatsProps) => {
		const participationRate =
			applicationCount > 0
				? Math.round((participatedCount / applicationCount) * 100)
				: 0

		const completionRate =
			participatedCount > 0
				? Math.round((completedCount / participatedCount) * 100)
				: 0

		return (
			<div className="space-y-6">
				{/* 섹션 제목 */}
				<div className="text-center">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						활동 통계
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						지금까지의 봉사활동 참여 현황을 확인하세요
					</p>
				</div>

				{/* 통계 카드들 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{/* 총 신청 수 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
								<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="text-right">
								<div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
									{applicationCount}
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									건
								</div>
							</div>
						</div>
						<div>
							<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
								총 신청 수
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								지금까지 신청한 봉사활동
							</div>
						</div>
					</div>

					{/* 선발된 수 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<div className="text-right">
								<div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
									{participatedCount}
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									건
								</div>
							</div>
						</div>
						<div>
							<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
								선발된 수
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								선발되어 참여한 활동
							</div>
							{applicationCount > 0 && (
								<div className="mt-2">
									<div className="text-xs text-green-600 dark:text-green-400 font-medium">
										선발률: {participationRate}%
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 완료한 수 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
								<Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div className="text-right">
								<div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
									{completedCount}
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									건
								</div>
							</div>
						</div>
						<div>
							<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
								완료한 수
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								성공적으로 완료한 활동
							</div>
							{participatedCount > 0 && (
								<div className="mt-2">
									<div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
										완료율: {completionRate}%
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 가입 기간 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
								<Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
							</div>
							<div className="text-right">
								<div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
									{format(memberSince, 'yyyy.MM', { locale: ko })}
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									가입
								</div>
							</div>
						</div>
						<div>
							<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
								멤버 기간
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								{format(memberSince, 'yyyy년 M월', { locale: ko })}부터
							</div>
							<div className="mt-2">
								<div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
									{Math.ceil(
										(Date.now() - memberSince.getTime()) /
											(1000 * 60 * 60 * 24),
									)}
									일째
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 추가 인사이트 */}
				{applicationCount > 0 && (
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
							활동 인사이트
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									평균 선발률
								</span>
								<span className="font-semibold text-blue-600 dark:text-blue-400">
									{participationRate}%
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									활동 완료율
								</span>
								<span className="font-semibold text-purple-600 dark:text-purple-400">
									{completionRate}%
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									월평균 신청
								</span>
								<span className="font-semibold text-green-600 dark:text-green-400">
									{Math.round(
										applicationCount /
											Math.max(
												1,
												Math.ceil(
													(Date.now() - memberSince.getTime()) /
														(1000 * 60 * 60 * 24 * 30),
												),
											),
									)}
									건
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600 dark:text-gray-400">
									활동 등급
								</span>
								<span className="font-semibold text-indigo-600 dark:text-indigo-400">
									{completedCount >= 10
										? '전문가'
										: completedCount >= 5
											? '숙련자'
											: completedCount >= 1
												? '참여자'
												: '신규'}
								</span>
							</div>
						</div>
					</div>
				)}

				{/* 빈 상태 메시지 */}
				{applicationCount === 0 && (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
							<FileText className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							아직 신청한 봉사활동이 없습니다
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							첫 번째 봉사활동에 참여해보세요!
						</p>
						<a
							href="/volunteer-activities"
							className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
						>
							봉사활동 둘러보기
						</a>
					</div>
				)}
			</div>
		)
	},
)

ProfileStats.displayName = 'ProfileStats'

export default ProfileStats
