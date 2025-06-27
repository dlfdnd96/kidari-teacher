'use client'

import React, { useEffect, useState } from 'react'
import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { Filter, Search, X } from 'lucide-react'
import {
	VOLUNTEER_ACTIVITY_FILTER_OPTIONS,
	VolunteerActivityFilterTabProps,
} from '@/types/volunteer-activity'

export default function ActivityFilterTab({
	selectedStatus,
	statusChangeAction,
	searchQuery,
	searchChangeAction,
}: VolunteerActivityFilterTabProps) {
	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (localSearchQuery !== searchQuery) {
				searchChangeAction(localSearchQuery)
			}
		}, 500)

		return () => clearTimeout(timeoutId)
	}, [localSearchQuery, searchQuery, searchChangeAction])

	useEffect(() => {
		setLocalSearchQuery(searchQuery)
	}, [searchQuery])

	const handleClearSearch = () => {
		setLocalSearchQuery('')
		searchChangeAction('')
	}

	return (
		<div>
			{/* 검색 및 필터 섹션 */}
			<div className="flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-3">
				{/* 검색바 */}
				<div className="relative w-full sm:w-80">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						type="text"
						placeholder="봉사활동 제목이나 내용으로 검색..."
						value={localSearchQuery}
						onChange={(e) => setLocalSearchQuery(e.target.value)}
						className="pl-10 pr-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
					/>
					{localSearchQuery && (
						<Button
							onClick={handleClearSearch}
							variant="ghost"
							size="icon"
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors h-auto w-auto p-0"
							aria-label="검색 초기화"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>

				{/* 오른쪽 필터 영역 */}
				<div className="flex items-center gap-3">
					{/* 상태 필터 드롭다운 */}
					<div className="w-full sm:w-80">
						<Select value={selectedStatus} onValueChange={statusChangeAction}>
							<SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
								<div className="flex items-center gap-2">
									<Filter className="w-4 h-4 text-gray-500" />
									<SelectValue placeholder="상태 선택" />
								</div>
							</SelectTrigger>
							<SelectContent>
								{VOLUNTEER_ACTIVITY_FILTER_OPTIONS.map((option) => {
									const IconComponent = option.icon
									return (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full ${option.color}`}
												/>
												<IconComponent className="w-4 h-4" />
												<span>{option.label}</span>
											</div>
										</SelectItem>
									)
								})}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	)
}
