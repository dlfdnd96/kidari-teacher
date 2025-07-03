import React from 'react'
import { NoticeSkeletonListProps } from '@/types/notice'

const NoticeSkeletonList: React.FC<NoticeSkeletonListProps> = ({
	count = 3,
	showHeader = true,
	showPagination = true,
}) => {
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
				</div>
			)}

			{/* 공지사항 목록 스켈레톤 */}
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 animate-pulse"
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
							<div className="flex gap-4">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
							</div>
						</div>
					</div>
					<div className="pt-3 border-t border-gray-200 dark:border-gray-600">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
					</div>
				</div>
			))}

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

export default NoticeSkeletonList
