'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock } from 'lucide-react'
import {
	ActivityFilterTabsProps,
	VOLUNTEER_ACTIVITY_FILTER_OPTIONS,
} from '@/types/volunteer-activity'

export default function ActivityFilterTabs({
	selectedStatus,
	onStatusChange,
	statusCounts,
}: ActivityFilterTabsProps) {
	const getCountForStatus = (status: string | 'all') => {
		if (status === 'all') {
			return statusCounts.reduce((total, item) => total + item.count, 0)
		}
		return statusCounts.find((item) => item.status === status)?.count || 0
	}

	return (
		<div className="space-y-4">
			{/* 필터 제목 */}
			<div className="flex items-center gap-2">
				<Calendar className="w-5 h-5 text-emerald-600" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					활동 상태별 보기
				</h3>
			</div>

			{/* 필터 버튼들 */}
			<div className="flex flex-wrap gap-3">
				{VOLUNTEER_ACTIVITY_FILTER_OPTIONS.map((option) => {
					const count = getCountForStatus(option.value)
					const isSelected = selectedStatus === option.value
					const IconComponent = option.icon

					return (
						<Button
							key={option.value}
							variant={isSelected ? option.variant : 'outline'}
							size="sm"
							onClick={() => onStatusChange(option.value)}
							className={`
                relative flex items-center gap-2 px-4 py-2 h-auto
                ${
									isSelected
										? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
										: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/20'
								}
                transition-all duration-200
              `}
						>
							{/* 상태 색상 표시 */}
							<div
								className={`w-2 h-2 rounded-full ${option.color} ${isSelected ? 'bg-white' : ''}`}
							/>

							{/* 아이콘 */}
							<IconComponent className="w-4 h-4" />

							{/* 라벨 */}
							<span className="font-medium">{option.label}</span>

							{/* 개수 배지 */}
							<Badge
								variant={isSelected ? 'secondary' : 'outline'}
								className={`
                  ml-1 px-2 py-0.5 text-xs
                  ${
										isSelected
											? 'bg-white/20 text-white border-white/30'
											: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300'
									}
                `}
							>
								{count}
							</Badge>
						</Button>
					)
				})}
			</div>

			{/* 현재 선택된 필터 정보 */}
			<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<Clock className="w-4 h-4" />
				<span>
					{selectedStatus === 'all'
						? `전체 ${getCountForStatus('all')}개의 봉사활동`
						: `${VOLUNTEER_ACTIVITY_FILTER_OPTIONS.find((opt) => opt.value === selectedStatus)?.label} 상태의 ${getCountForStatus(selectedStatus)}개 활동`}
				</span>
			</div>
		</div>
	)
}
