import { useMemo } from 'react'
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from '@/constants/landing'
import { ZodType } from '@/types'
import { ActivityRecordSchema } from '@/schemas/landing'

interface ActivityStatisticsProps {
	activityData: ZodType<typeof ActivityRecordSchema>
}

export function ActivityStatistics({ activityData }: ActivityStatisticsProps) {
	const completedActivitiesCount = useMemo(() => {
		return (
			activityData.activities.filter(
				(activity) =>
					activity.status === ACTIVITY_STATUS.COMPLETED &&
					activity.type === ACTIVITY_TYPE.HIGH_SCHOOL,
			).length ?? 0
		)
	}, [activityData])

	const schoolCount = activityData.summary.schoolCount
	const yearsActive = activityData.summary.years.length

	return (
		<div className="mt-16 max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
				<div className="space-y-2">
					<p className="text-5xl font-bold text-foreground leading-normal">
						{completedActivitiesCount}
					</p>
					<h4 className="text-xl font-semibold text-blue-400 md:text-base leading-relaxed tracking-tight">
						총 활동 수
					</h4>
					<p className="text-sm text-foreground/60 leading-normal">
						완료된 멘토링 활동
					</p>
				</div>

				<div className="space-y-2">
					<p className="text-5xl font-bold text-foreground leading-normal">
						{schoolCount}
					</p>
					<h4 className="text-xl font-semibold text-green-400 md:text-base leading-relaxed tracking-tight">
						협력 학교 수
					</h4>
					<p className="text-sm text-foreground/60 leading-normal">
						함께하는 학교
					</p>
				</div>

				<div className="space-y-2">
					<p className="text-5xl font-bold text-foreground leading-normal">
						{yearsActive}년
					</p>
					<h4 className="text-xl font-semibold text-purple-400 md:text-base leading-relaxed tracking-tight">
						활동 연차
					</h4>
					<p className="text-sm text-foreground/60 leading-normal">
						지속적인 봉사활동
					</p>
				</div>
			</div>
		</div>
	)
}
