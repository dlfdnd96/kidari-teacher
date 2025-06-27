'use client'

import React, { memo, useCallback } from 'react'
import { Calendar, Clock, Heart, MapPin, User, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import { Enum } from '@/enums'
import {
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityCardProps,
} from '@/types/volunteer-activity'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'

const VolunteerActivityCard = memo(
	({ activity, onViewDetail, onApply }: VolunteerActivityCardProps) => {
		const { data: session } = useSession()

		const applicationCount = activity.applications?.length || 0
		const maxParticipants = activity.maxParticipants || 0

		const statusColor =
			VOLUNTEER_ACTIVITY_STATUS_COLORS[activity.status] ||
			'bg-gray-100 text-gray-800'
		const statusLabel =
			VOLUNTEER_ACTIVITY_STATUS_LABELS[activity.status] || activity.status

		const handleViewDetail = useCallback(() => {
			onViewDetail(activity)
		}, [activity, onViewDetail])

		const handleApply = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation()
				onApply(activity)
			},
			[activity, onApply],
		)

		return (
			<div
				className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden group"
				onClick={handleViewDetail}
			>
				{/* 카드 헤더 */}
				<div className="p-4 pb-3">
					{/* 상태 배지 */}
					<div className="flex items-center justify-between mb-3">
						<div
							className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
						>
							{statusLabel}
						</div>
						<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
							<Heart className="w-3 h-3" />
							<span>{applicationCount}</span>
						</div>
					</div>

					{/* 제목 */}
					<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
						{activity.title}
					</h3>

					{/* 설명 */}
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
						{activity.description}
					</p>

					{/* 기본 정보 */}
					<div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
						{/* 관리자 */}
						<div className="flex items-center gap-2">
							<User className="w-3 h-3" />
							<span>{activity.manager?.name || '관리자'}</span>
						</div>

						{/* 일시 */}
						<div className="flex items-center gap-2">
							<Calendar className="w-3 h-3" />
							<span>
								{format(
									new TZDate(activity.startAt, TIME_ZONE.SEOUL),
									'M월 d일 (E)',
									{ locale: ko },
								)}
							</span>
						</div>

						{/* 장소 */}
						<div className="flex items-center gap-2">
							<MapPin className="w-3 h-3" />
							<span className="truncate">{activity.location}</span>
						</div>

						{/* 신청 현황 */}
						<div className="flex items-center gap-2">
							<Users className="w-3 h-3" />
							<span>
								{applicationCount}명
								{maxParticipants > 0 && ` / ${maxParticipants}명`}
							</span>
						</div>

						{/* 신청 마감일 */}
						<div className="flex items-center gap-2">
							<Clock className="w-3 h-3" />
							<span>
								{format(
									new TZDate(activity.applicationDeadline, TIME_ZONE.SEOUL),
									'M월 d일까지',
									{ locale: ko },
								)}
							</span>
						</div>
					</div>
				</div>

				{/* 카드 푸터 */}
				<div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
					<div className="flex items-center justify-between min-h-[32px]">
						{/* 생성일 */}
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{format(activity.createdAt, 'yyyy.MM.dd')}
						</span>

						{/* 액션 버튼들 */}
						<div className="flex items-center gap-2 min-h-[24px]">
							{/* 신청 버튼 (조건부) */}
							{session?.user.id &&
								activity.status === Enum.VolunteerActivityStatus.RECRUITING &&
								!activity.applications?.some(
									(app) => app.user?.id === session?.user.id,
								) && (
									<button
										onClick={handleApply}
										className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
									>
										<span>신청</span>
									</button>
								)}
						</div>
					</div>
				</div>
			</div>
		)
	},
)

VolunteerActivityCard.displayName = 'VolunteerActivityCard'

export default VolunteerActivityCard
