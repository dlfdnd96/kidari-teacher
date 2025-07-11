'use client'

import React, { memo, useMemo } from 'react'
import { Calendar, FileText, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ProfileStatsProps, StatCardData } from '@/types/profile'

const StatCard = memo(
	({
		icon: Icon,
		title,
		value,
		description,
		color,
		additionalInfo,
	}: StatCardData) => {
		const colorClasses = {
			blue: {
				bg: 'bg-blue-100 dark:bg-blue-900/30',
				text: 'text-blue-600 dark:text-blue-400',
				border: 'border-blue-200/50 dark:border-blue-700/50',
			},
			purple: {
				bg: 'bg-purple-100 dark:bg-purple-900/30',
				text: 'text-purple-600 dark:text-purple-400',
				border: 'border-purple-200/50 dark:border-purple-700/50',
			},
			indigo: {
				bg: 'bg-indigo-100 dark:bg-indigo-900/30',
				text: 'text-indigo-600 dark:text-indigo-400',
				border: 'border-indigo-200/50 dark:border-indigo-700/50',
			},
		}

		const classes = colorClasses[color]

		return (
			<div
				className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${classes.border} p-6 group`}
			>
				<div className="flex items-center justify-between mb-4">
					<div
						className={`w-12 h-12 ${classes.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
					>
						<Icon className={`w-6 h-6 ${classes.text}`} />
					</div>
					<div className="text-right">
						<div className={`text-2xl sm:text-3xl font-bold ${classes.text}`}>
							{value}
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">건</div>
					</div>
				</div>
				<div>
					<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
						{title}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{description}
					</div>
					{additionalInfo && (
						<div className="mt-2">
							<div className={`text-xs ${classes.text} font-medium`}>
								{additionalInfo}
							</div>
						</div>
					)}
				</div>
			</div>
		)
	},
)

StatCard.displayName = 'StatCard'

const MembershipCard = memo(({ memberSince }: { memberSince: Date }) => {
	const daysSinceMember = useMemo(() => {
		return Math.ceil(
			(Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24),
		)
	}, [memberSince])

	const formattedDate = useMemo(() => {
		return format(memberSince, 'yyyy.MM', { locale: ko })
	}, [memberSince])

	const formattedFullDate = useMemo(() => {
		return format(memberSince, 'yyyy년 M월', { locale: ko })
	}, [memberSince])

	return (
		<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-indigo-200/50 dark:border-indigo-700/50 p-6 group sm:col-span-2 lg:col-span-1">
			<div className="flex items-center justify-between mb-4">
				<div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
					<Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div className="text-right">
					<div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
						{formattedDate}
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400">가입</div>
				</div>
			</div>
			<div>
				<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
					멤버 기간
				</div>
				<div className="text-sm text-gray-600 dark:text-gray-400">
					{formattedFullDate}부터
				</div>
				<div className="mt-2">
					<div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
						{daysSinceMember}일째
					</div>
				</div>
			</div>
		</div>
	)
})

MembershipCard.displayName = 'MembershipCard'

const ProfileStats = memo(
	({
		applicationCount,
		participatedCount,
		completedCount,
		memberSince,
	}: ProfileStatsProps) => {
		const completionRate = useMemo(() => {
			return participatedCount > 0
				? Math.round((completedCount / participatedCount) * 100)
				: 0
		}, [participatedCount, completedCount])

		const statsData: StatCardData[] = useMemo(
			() => [
				{
					icon: FileText,
					title: '총 신청 수',
					value: applicationCount,
					description: '지금까지 신청한 봉사활동',
					color: 'blue' as const,
				},
				{
					icon: Trophy,
					title: '완료한 수',
					value: completedCount,
					description: '성공적으로 완료한 활동',
					color: 'purple' as const,
					additionalInfo:
						participatedCount > 0 ? `완료율: ${completionRate}%` : undefined,
				},
			],
			[applicationCount, completedCount, participatedCount, completionRate],
		)

		return (
			<div className="space-y-6">
				{/* 통계 카드들 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
					{statsData.map((stat) => (
						<StatCard key={stat.title} {...stat} />
					))}

					{/* 가입 기간 카드 */}
					<MembershipCard memberSince={memberSince} />
				</div>
			</div>
		)
	},
)

ProfileStats.displayName = 'ProfileStats'

export default ProfileStats
