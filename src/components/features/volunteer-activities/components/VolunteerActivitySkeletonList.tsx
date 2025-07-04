import React from 'react'
import { VolunteerActivitySkeletonListProps } from '@/types/volunteer-activity'

const VolunteerActivitySkeletonList: React.FC<
	VolunteerActivitySkeletonListProps
> = ({ count = 12, showHeader = true, showPagination = true }) => {
	return (
		<div className="space-y-6">
			{/* 헤더 스켈레톤 */}
			{showHeader && (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
						</div>
					</div>

					{/* 생성 버튼 스켈레톤 */}
					<div className="flex justify-end">
						<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse" />
					</div>

					{/* 검색/필터 스켈레톤 */}
					<div className="flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-3">
						<div className="w-full sm:w-80 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
						<div className="w-full sm:w-80 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
					</div>
				</div>
			)}

			{/* 봉사활동 목록 스켈레톤 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: count }).map((_, i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
					>
						{/* 카드 헤더 */}
						<div className="p-4 pb-3">
							{/* 상태 배지와 신청 수 */}
							<div className="flex items-center justify-between mb-3">
								<div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
								<div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>

							{/* 제목 */}
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />

							{/* 설명 */}
							<div className="space-y-1 mb-3">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
							</div>

							{/* 기본 정보 */}
							<div className="space-y-2">
								{Array.from({ length: 5 }).map((_, j) => (
									<div key={j} className="flex items-center gap-2">
										<div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
										<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
									</div>
								))}
							</div>
						</div>

						{/* 카드 푸터 */}
						<div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
							<div className="flex items-center justify-between">
								<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* 페이지네이션 스켈레톤 */}
			{showPagination && (
				<div className="flex items-center justify-center space-x-2">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="hidden sm:flex space-x-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
							/>
						))}
					</div>
					<div className="sm:hidden w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				</div>
			)}
		</div>
	)
}

export default VolunteerActivitySkeletonList
