import React, { memo } from 'react'
import { VolunteerActivityCard } from '.'
import { VolunteerActivityListProps } from '@/types/volunteer-activity'

const VolunteerActivityList = memo(
	({ activities, onViewDetail, onApply }: VolunteerActivityListProps) => {
		return (
			<div className="space-y-6 sm:space-y-8">
				{/* 전체 활동들 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{activities.map((activity) => (
						<div
							key={activity.id}
							className="transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
						>
							<VolunteerActivityCard
								activity={activity}
								onViewDetail={onViewDetail}
								onApply={onApply}
							/>
						</div>
					))}
				</div>
			</div>
		)
	},
)

VolunteerActivityList.displayName = 'VolunteerActivityList'

export default VolunteerActivityList
