import { useMemo } from 'react'
import { LinearH4, LinearText } from '@/components/ui/linear/linear-typography'
import type { ActivityStatisticsProps } from '@/types/landing'
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from '@/constants/landing'

export function ActivityStatistics({ activityData }: ActivityStatisticsProps) {
	const completedActivitiesCount = useMemo(() => {
		return (
			activityData?.activities.filter(
				(activity) =>
					activity.status === ACTIVITY_STATUS.COMPLETED &&
					activity.type === ACTIVITY_TYPE.HIGH_SCHOOL,
			).length ?? 0
		)
	}, [activityData])

	const schoolCount = activityData?.summary.schoolCount ?? 0
	const yearsActive = activityData?.summary.years.length ?? 0

	return (
		<div className="mt-16 max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
				<div className="space-y-2">
					<LinearText className="text-5xl font-bold text-white">
						{completedActivitiesCount}
					</LinearText>
					<LinearH4 className="text-xl font-semibold text-blue-400">
						총 활동 수
					</LinearH4>
					<LinearText className="text-sm text-white/60">
						완료된 멘토링 활동
					</LinearText>
				</div>

				<div className="space-y-2">
					<LinearText className="text-5xl font-bold text-white">
						{schoolCount}
					</LinearText>
					<LinearH4 className="text-xl font-semibold text-green-400">
						협력 학교 수
					</LinearH4>
					<LinearText className="text-sm text-white/60">
						함께하는 학교
					</LinearText>
				</div>

				<div className="space-y-2">
					<LinearText className="text-5xl font-bold text-white">
						{yearsActive}년
					</LinearText>
					<LinearH4 className="text-xl font-semibold text-purple-400">
						활동 연차
					</LinearH4>
					<LinearText className="text-sm text-white/60">
						지속적인 봉사활동
					</LinearText>
				</div>
			</div>
		</div>
	)
}
