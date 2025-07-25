import React from 'react'
import { Skeleton } from '@/components/ui'

const ProfileSkeleton: React.FC = () => {
	return (
		<div className="space-y-6">
			{/* 헤더 스켈레톤 */}
			<div className="text-center mb-8">
				<Skeleton className="h-8 w-48 mx-auto mb-2" />
				<Skeleton className="h-4 w-64 mx-auto" />
			</div>

			{/* 프로필 카드 스켈레톤 */}
			<div className="bg-white border border-gray-200 rounded-lg animate-pulse">
				<div className="border-b border-gray-200 p-6">
					<Skeleton className="h-6 w-40" />
				</div>
				<div className="p-6">
					<div className="flex flex-col sm:flex-row items-start gap-6">
						<Skeleton className="w-20 h-20 rounded-full" />
						<div className="flex-1 space-y-4">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</div>
			</div>

			{/* 통계 스켈레톤 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
					>
						<div className="flex items-center justify-between mb-4">
							<Skeleton className="w-12 h-12 rounded-lg" />
							<div className="text-right">
								<Skeleton className="h-8 w-12 mb-1" />
								<Skeleton className="h-3 w-6" />
							</div>
						</div>
						<Skeleton className="h-4 w-24 mb-1" />
						<Skeleton className="h-3 w-32" />
					</div>
				))}
			</div>

			{/* 추가 프로필 스켈레톤 */}
			<div className="bg-white border border-gray-200 rounded-lg animate-pulse">
				<div className="border-b border-gray-200 p-6">
					<Skeleton className="h-6 w-40" />
				</div>
				<div className="p-6">
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfileSkeleton
