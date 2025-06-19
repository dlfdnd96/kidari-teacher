import React from 'react'
import MyApplicationCard from '@/components/features/applications/MyApplicationCard'
import { Separator } from '@/components/ui/separator'
import {
	MY_APPLICATION_LIST_STATUS_LABELS,
	MY_APPLICATION_STATUS_ORDER,
	MyApplicationListProps,
} from '@/types/application'

export default function MyApplicationList({
	applications,
	isLoading = false,
}: MyApplicationListProps) {
	const groupedApplications = React.useMemo(() => {
		const groups: Record<string, typeof applications> = {}

		applications.forEach((application) => {
			const status = application.status
			if (!groups[status]) {
				groups[status] = []
			}
			groups[status].push(application)
		})

		return groups
	}, [applications])

	const statusKeys = Object.keys(groupedApplications)
	const showGroupHeaders = statusKeys.length > 1

	if (isLoading) {
		return (
			<div className="space-y-6 sm:space-y-8">
				{/* 스켈레톤 로딩 */}
				<div className="space-y-4 sm:space-y-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 animate-pulse border-l-4 border-l-gray-300"
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
										<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
										<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
									</div>
								</div>
								<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
							</div>
							<div className="space-y-2 mb-4">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
							</div>
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
			{showGroupHeaders ? (
				MY_APPLICATION_STATUS_ORDER.map((status) => {
					const statusApplications = groupedApplications[status]
					if (!statusApplications || statusApplications.length === 0) {
						return null
					}

					return (
						<div key={status} className="space-y-4">
							{/* 그룹 헤더 */}
							<div className="flex items-center gap-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{MY_APPLICATION_LIST_STATUS_LABELS[status]}
								</h3>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{statusApplications.length}개
								</div>
								<Separator className="flex-1" />
							</div>

							{/* 해당 상태의 신청들 */}
							<div className="space-y-4 sm:space-y-6">
								{statusApplications.map((application, index) => (
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
				})
			) : (
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
			)}
		</div>
	)
}
