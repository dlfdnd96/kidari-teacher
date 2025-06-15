import React from 'react'
import VolunteerActivityCard from '@/components/features/volunteer-activities/VolunteerActivityCard'
import type { VolunteerActivityListProps } from '@/types/volunteer-activity'

export default function VolunteerActivityList({
	activities,
	onViewDetail,
	onApply,
	onEdit,
	onDelete,
	currentUserId,
	userRole,
}: VolunteerActivityListProps) {
	return (
		<div className="space-y-6 sm:space-y-8">
			{/* 봉사활동 카드들 */}
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
							currentUserId={currentUserId}
							userRole={userRole}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
