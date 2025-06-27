'use client'

import React, { useCallback, useState } from 'react'
import { trpc } from '@/components/providers/TrpcProvider'
import ProfileCard from '@/components/features/profile/ProfileCard'
import ProfileForm from '@/components/features/profile/ProfileForm'
import ProfileStats from '@/components/features/profile/ProfileStats'
import UserProfileCard from '@/components/features/profile/UserProfileCard'
import UserProfileForm from '@/components/features/profile/UserProfileForm'
import { Alert, AlertDescription, Button, Skeleton } from '@/components/ui'
import { AlertCircle, RefreshCw } from 'lucide-react'
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
	} = trpc.user.getUser.useQuery(undefined, {
		initialData: initialUser,
		staleTime: 5 * 60 * 1000,
	})

	const {
		data: stats,
		isError: statsError,
		error: statsErrorMsg,
		refetch: refetchStats,
	} = trpc.userProfile.getProfileStats.useQuery(undefined, {
		staleTime: 5 * 60 * 1000,
	})

	const { data: userProfile, refetch: refetchUserProfile } =
		trpc.userProfile.getUserProfileWithProfessions.useQuery(undefined, {
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

	if (userError || !user) {
		return (
			<div className="text-center py-16">
				<div className="bg-white border border-gray-200 rounded-lg p-12 max-w-md mx-auto">
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
							<AlertCircle className="w-8 h-8 text-red-500" />
						</div>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						프로필을 불러올 수 없습니다
					</h3>
					<p className="text-gray-500 mb-6">
						네트워크 연결을 확인하고 다시 시도해주세요.
					</p>
					<Button
						onClick={handleRefresh}
						className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						다시 시도
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* 페이지 헤더 */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">프로필</h1>
			</div>

			{/* 프로필 정보 섹션 */}
			<div>
				{!isEditing ? (
					<ProfileCard user={user} onEdit={handleEdit} canEdit={true} />
				) : (
					<ProfileForm onCancel={handleCancelEdit} refetchUser={refetchUser} />
				)}
			</div>

			{/* 추가 프로필 정보 섹션 */}
			<div>
				{isEditingUserProfile ? (
					<UserProfileForm
						onCancel={handleCancelEditUserProfile}
						isSetup={false}
						initialData={userProfile}
					/>
				) : (
					<UserProfileCard
						profile={userProfile ?? null}
						onEdit={handleEditUserProfile}
						onCreate={handleCreateUserProfile}
						canEdit={true}
					/>
				)}
			</div>

			{/* 활동 통계 섹션 */}
			{stats && (
				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">활동 통계</h2>
					</div>
					<ProfileStats
						applicationCount={stats.totalApplications}
						participatedCount={stats.selectedApplications}
						completedCount={stats.completedActivities}
						memberSince={stats.memberSince}
					/>
				</div>
			)}

			{/* 통계 에러 상태 */}
			{statsError && (
				<div className="bg-white border border-red-200 rounded-lg p-6">
					<Alert variant="destructive" className="border-0 bg-transparent">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							활동 통계를 불러올 수 없습니다: {statsErrorMsg?.message}
						</AlertDescription>
					</Alert>
				</div>
			)}
		</div>
	)
}
