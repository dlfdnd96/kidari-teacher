'use client'

import React from 'react'
import { Badge, Button } from '@/components/ui'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FileText, Clock, X, Filter } from 'lucide-react'
import {
	MY_APPLICATION_FILTER_OPTIONS,
	MyApplicationFilterTabProps,
} from '@/types/application'

export default function MyApplicationFilterTab({
	selectedStatus,
	statusChangeAction,
	allStatusCount,
}: MyApplicationFilterTabProps) {
	const handleClearAllFilters = () => {
		statusChangeAction('all')
	}

	const hasActiveFilters = selectedStatus !== 'all'
	const selectedFilter = MY_APPLICATION_FILTER_OPTIONS.find(
		(opt) => opt.value === selectedStatus,
	)

	return (
		<div className="space-y-4">
			{/* 헤더 섹션 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<FileText className="w-5 h-5 text-blue-600" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						신청 현황
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

			{/* 필터 섹션 */}
			<div className="flex flex-col sm:flex-row gap-3">
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
							{MY_APPLICATION_FILTER_OPTIONS.map((option) => {
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
				{/* 활성 필터 배지 */}
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
					{`${selectedFilter?.label} 상태의 신청을 표시하고 있습니다.`}
				</div>
			)}
		</div>
	)
}
