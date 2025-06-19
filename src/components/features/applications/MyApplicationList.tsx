import React from 'react'
import MyApplicationCard from '@/components/features/applications/MyApplicationCard'
import type { MyApplicationListProps } from '@/types/application'

export default function MyApplicationList({
	applications,
	isLoading = false,
}: MyApplicationListProps) {
	if (isLoading) {
		return (
			<div className="space-y-6 sm:space-y-8">
				{/* 스켈레톤 로딩 */}
				<div className="space-y-4 sm:space-y-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
								</div>
								<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
							</div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
							<div className="space-y-2 mb-4">
								{[1, 2, 3, 4].map((j) => (
									<div key={j} className="flex items-center gap-2">
										<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
									</div>
								))}
							</div>
							<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
								<div className="flex items-center">
									<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
								</div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* 내 신청 카드들 */}
			<div className="space-y-4 sm:space-y-6">
				{applications.map((application, index) => (
					<div
						key={application.id}
						className="transform transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
						style={{
							animationDelay: `${index * 100}ms`,
						}}
					>
						<MyApplicationCard application={application} />
					</div>
				))}
			</div>
		</div>
	)
}
