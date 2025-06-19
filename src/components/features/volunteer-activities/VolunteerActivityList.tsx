import React from 'react'
import VolunteerActivityCard from '@/components/features/volunteer-activities/VolunteerActivityCard'
import {
	VOLUNTEER_ACTIVITY_LIST_STATUS_LABELS,
	VOLUNTEER_ACTIVITY_STATUS_ORDER,
	VolunteerActivityListProps,
} from '@/types/volunteer-activity'
import { Separator } from '@/components/ui/separator'

export default function VolunteerActivityList({
	activities,
	onViewDetail,
	onApply,
	onEdit,
	onDelete,
}: VolunteerActivityListProps) {
	const groupedActivities = React.useMemo(() => {
		const groups: Record<string, typeof activities> = {}

		activities.forEach((activity) => {
			const status = activity.status
			if (!groups[status]) {
				groups[status] = []
			}
			groups[status].push(activity)
		})

		return groups
	}, [activities])

	const statusKeys = Object.keys(groupedActivities)
	const showGroupHeaders = statusKeys.length > 1

	return (
		<div className="space-y-6 sm:space-y-8">
			{showGroupHeaders ? (
				VOLUNTEER_ACTIVITY_STATUS_ORDER.map((status) => {
					const statusActivities = groupedActivities[status]
					if (!statusActivities || statusActivities.length === 0) {
						return null
					}

					return (
						<div key={status} className="space-y-4">
							{/* 그룹 헤더 */}
							<div className="flex items-center gap-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{VOLUNTEER_ACTIVITY_LIST_STATUS_LABELS[status]}
								</h3>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{statusActivities.length}개
								</div>
								<Separator className="flex-1" />
							</div>

							{/* 해당 상태의 활동들 */}
							<div className="space-y-4 sm:space-y-6">
								{statusActivities.map((activity, index) => (
									<div
										key={activity.id}
										className="transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
										style={{
											animationDelay: `${index * 100}ms`,
										}}
									>
										<VolunteerActivityCard
											activity={activity}
											onViewDetail={onViewDetail}
											onApply={onApply}
											onEdit={onEdit}
											onDelete={onDelete}
										/>
									</div>
								))}
							</div>
						</div>
					)
				})
			) : (
				<div className="space-y-4 sm:space-y-6">
					{activities.map((activity, index) => (
						<div
							key={activity.id}
							className="transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
							style={{
								animationDelay: `${index * 100}ms`,
							}}
						>
							<VolunteerActivityCard
								activity={activity}
								onViewDetail={onViewDetail}
								onApply={onApply}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
