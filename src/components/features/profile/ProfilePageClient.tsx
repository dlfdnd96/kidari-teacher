'use client'

import React, { useCallback, useState } from 'react'
import { trpc } from '@/components/providers/TrpcProvider'
import ProfileCard from '@/components/features/profile/ProfileCard'
import ProfileForm from '@/components/features/profile/ProfileForm'
import ProfileStats from '@/components/features/profile/ProfileStats'
import UserProfileCard from '@/components/features/profile/UserProfileCard'
import UserProfileForm from '@/components/features/profile/UserProfileForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProfilePageClientProps } from '@/types/profile'

export default function ProfilePageClient({
	initialUser,
}: ProfilePageClientProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [isEditingUserProfile, setIsEditingUserProfile] = useState(false)

	const {
		data: user,
		isLoading: userLoading,
		isError: userError,
		refetch: refetchUser,
	} = trpc.user.getCurrentUser.useQuery(undefined, {
		initialData: initialUser,
		staleTime: 5 * 60 * 1000,
	})

	const {
		data: stats,
		isError: statsError,
		error: statsErrorMsg,
		refetch: refetchStats,
	} = trpc.user.getProfileStats.useQuery(undefined, {
		staleTime: 5 * 60 * 1000,
	})

	const { data: userProfile, refetch: refetchUserProfile } =
		trpc.user.getUserProfile.useQuery(undefined, {
			staleTime: 5 * 60 * 1000,
			retry: false,
		})

	const handleEdit = useCallback(() => {
		setIsEditing(true)
	}, [])

	const handleCancelEdit = useCallback(() => {
		setIsEditing(false)
	}, [])

	const handleRefresh = useCallback(() => {
		refetchUser()
		refetchStats()
		refetchUserProfile()
	}, [refetchUser, refetchStats, refetchUserProfile])

	const handleEditUserProfile = useCallback(() => {
		setIsEditingUserProfile(true)
	}, [])

	const handleCancelEditUserProfile = useCallback(() => {
		setIsEditingUserProfile(false)
	}, [])

	const handleCreateUserProfile = useCallback(() => {
		setIsEditingUserProfile(true)
	}, [])

	if (userLoading) {
		return (
			<div className="space-y-6">
				{/* 프로필 카드 스켈레톤 */}
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
					<div className="flex items-center gap-6">
						<Skeleton className="w-24 h-24 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-32" />
						</div>
						<Skeleton className="h-10 w-20" />
					</div>
				</div>

				{/* 통계 스켈레톤 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
						>
							<Skeleton className="w-12 h-12 rounded-xl mb-4" />
							<Skeleton className="h-8 w-16 mb-2" />
							<Skeleton className="h-4 w-24" />
						</div>
					))}
				</div>

				{/* 설정 스켈레톤 */}
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
			</div>
		)
	}

	if (userError || !user) {
		return (
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<AlertCircle className="w-16 h-16 text-red-400 dark:text-red-500" />
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					프로필을 불러올 수 없습니다
				</h3>
				<Button
					onClick={handleRefresh}
					className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
				>
					<RefreshCw className="w-4 h-4 mr-1.5" />
					<span>다시 시도</span>
				</Button>
			</div>
		)
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* 프로필 정보 섹션 */}
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
				{!isEditing ? (
					<ProfileCard user={user} onEdit={handleEdit} canEdit={true} />
				) : (
					<ProfileForm onCancel={handleCancelEdit} refetchUser={refetchUser} />
				)}
			</div>

			{/* 추가 프로필 정보 섹션 */}
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
				{!isEditingUserProfile ? (
					<UserProfileCard
						profile={userProfile || null}
						onEdit={handleEditUserProfile}
						onCreate={handleCreateUserProfile}
						canEdit={true}
					/>
				) : (
					<UserProfileForm
						onCancel={handleCancelEditUserProfile}
						isSetup={false}
						initialData={userProfile}
					/>
				)}
			</div>

			{/* 활동 통계 섹션 */}
			{stats && (
				<ProfileStats
					applicationCount={stats.totalApplications}
					participatedCount={stats.selectedApplications}
					completedCount={stats.completedActivities}
					memberSince={stats.memberSince}
				/>
			)}

			{/* 통계 에러 상태 */}
			{statsError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						활동 통계를 불러올 수 없습니다: {statsErrorMsg?.message}
					</AlertDescription>
				</Alert>
			)}
		</div>
	)
}
