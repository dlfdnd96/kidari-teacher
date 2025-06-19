'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, Search, X, Filter } from 'lucide-react'
import {
	VolunteerActivityFilterTabProps,
	VOLUNTEER_ACTIVITY_FILTER_OPTIONS,
} from '@/types/volunteer-activity'

export default function ActivityFilterTab({
	selectedStatus,
	statusChangeAction,
	allStatusCount,
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

	const handleClearAllFilters = () => {
		statusChangeAction('all')
		handleClearSearch()
	}

	const hasActiveFilters = selectedStatus !== 'all' || searchQuery.trim() !== ''
	const selectedFilter = VOLUNTEER_ACTIVITY_FILTER_OPTIONS.find(
		(opt) => opt.value === selectedStatus,
	)

	return (
		<div className="space-y-4">
			{/* 헤더 섹션 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Calendar className="w-5 h-5 text-emerald-600" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						활동 검색
					</h3>
				</div>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClearAllFilters}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 px-3"
					>
						<X className="w-4 h-4 mr-1" />
						초기화
					</Button>
				)}
			</div>

			{/* 검색 및 필터 섹션 */}
			<div className="flex flex-col sm:flex-row gap-3">
				{/* 검색바 */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						type="text"
						placeholder="봉사활동 제목이나 내용으로 검색..."
						value={localSearchQuery}
						onChange={(e) => setLocalSearchQuery(e.target.value)}
						className="pl-10 pr-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
					/>
					{localSearchQuery && (
						<button
							onClick={handleClearSearch}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							aria-label="검색 초기화"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>

				{/* 상태 필터 드롭다운 */}
				<div className="w-full sm:w-48">
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
											<div className={`w-2 h-2 rounded-full ${option.color}`} />
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

			{/* 활성 필터 및 결과 표시 */}
			<div className="flex flex-wrap items-center gap-2">
				{/* 활성 필터 배지들 */}
				{searchQuery.trim() && (
					<Badge
						variant="secondary"
						className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
					>
						<Search className="w-3 h-3 mr-1" />
						검색: {searchQuery}
						<button
							onClick={handleClearSearch}
							className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
						>
							<X className="w-3 h-3" />
						</button>
					</Badge>
				)}

				{selectedStatus !== 'all' && selectedFilter && (
					<Badge
						variant="secondary"
						className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
					>
						<div
							className={`w-2 h-2 rounded-full ${selectedFilter.color} mr-1`}
						/>
						상태: {selectedFilter.label}
						<button
							onClick={() => statusChangeAction('all')}
							className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
						>
							<X className="w-3 h-3" />
						</button>
					</Badge>
				)}

				{/* 결과 카운트 */}
				<div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 ml-auto">
					<Clock className="w-4 h-4" />
					<span className="font-medium">{allStatusCount}개</span>
					<span>결과</span>
				</div>
			</div>

			{/* 필터 설명 (필터가 적용된 경우만) */}
			{hasActiveFilters && (
				<div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
					{searchQuery.trim() && selectedStatus !== 'all'
						? `"${searchQuery}" 검색 결과 중 ${selectedFilter?.label} 상태의 활동을 표시하고 있습니다.`
						: searchQuery.trim()
							? `"${searchQuery}" 검색 결과를 표시하고 있습니다.`
							: `${selectedFilter?.label} 상태의 활동을 표시하고 있습니다.`}
				</div>
			)}
		</div>
	)
}
