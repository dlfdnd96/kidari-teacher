'use client'

import React, { memo, useCallback, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, Button } from '@/components/ui'
import type { ProfileEditState, ProfilePageClientProps } from '@/types/profile'
import {
	ProfileCard,
	ProfileForm,
	ProfileSkeleton,
	ProfileStats,
	UserProfileCard,
	UserProfileForm,
} from './components'
import { useProfileActions, useUserProfileActions } from './hooks'

const ProfileErrorState = memo(({ onRetry }: { onRetry: () => void }) => (
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
			<div className="flex justify-center">
				<Button
					onClick={onRetry}
					variant="outline"
					className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
				>
					<RefreshCw className="w-4 h-4" />
					<span>다시 시도</span>
				</Button>
			</div>
		</div>
	</div>
))

ProfileErrorState.displayName = 'ProfileErrorState'

const StatsErrorAlert = memo(({ errorMessage }: { errorMessage: string }) => (
	<div className="bg-white border border-red-200 rounded-lg p-6">
		<Alert variant="destructive" className="border-0 bg-transparent">
			<AlertCircle className="h-4 w-4" />
			<AlertDescription>
				활동 통계를 불러올 수 없습니다: {errorMessage}
			</AlertDescription>
		</Alert>
	</div>
))

StatsErrorAlert.displayName = 'StatsErrorAlert'

const ProfilePageClient = memo(({ initialUser }: ProfilePageClientProps) => {
	const [editState, setEditState] = useState<ProfileEditState>({
		isEditing: false,
		isEditingUserProfile: false,
	})

	const { getUserQuery } = useProfileActions()
	const { getUserProfileStatQuery, getUserProfileWithProfessionsQuery } =
		useUserProfileActions()

	const {
		data: user,
		isLoading: userLoading,
		isError: userError,
		refetch: refetchUser,
	} = getUserQuery(undefined, {
		initialData: initialUser,
		staleTime: 5 * 60 * 1000,
	})

	const {
		data: stats,
		isError: statsError,
		error: statsErrorMsg,
		refetch: refetchStats,
	} = getUserProfileStatQuery(undefined, {
		staleTime: 5 * 60 * 1000,
	})

	const { data: userProfile, refetch: refetchUserProfile } =
		getUserProfileWithProfessionsQuery(undefined, {
			staleTime: 5 * 60 * 1000,
			retry: false,
		})

	const handleEdit = useCallback(() => {
		setEditState((prev) => ({ ...prev, isEditing: true }))
	}, [])

	const handleCancelEdit = useCallback(() => {
		setEditState((prev) => ({ ...prev, isEditing: false }))
	}, [])

	const handleEditUserProfile = useCallback(() => {
		setEditState((prev) => ({ ...prev, isEditingUserProfile: true }))
	}, [])

	const handleCancelEditUserProfile = useCallback(() => {
		setEditState((prev) => ({ ...prev, isEditingUserProfile: false }))
	}, [])

	const handleCreateUserProfile = useCallback(() => {
		setEditState((prev) => ({ ...prev, isEditingUserProfile: true }))
	}, [])

	const handleRefresh = useCallback(() => {
		refetchUser()
		refetchStats()
		refetchUserProfile()
	}, [refetchUser, refetchStats, refetchUserProfile])

	if (userLoading) {
		return <ProfileSkeleton />
	}

	if (userError || !user) {
		return <ProfileErrorState onRetry={handleRefresh} />
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* 페이지 헤더 */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">프로필</h1>
			</div>

			{/* 프로필 정보 섹션 */}
			<div>
				{!editState.isEditing ? (
					<ProfileCard user={user} onEdit={handleEdit} canEdit={true} />
				) : (
					<ProfileForm onCancel={handleCancelEdit} refetchUser={refetchUser} />
				)}
			</div>

			{/* 추가 프로필 정보 섹션 */}
			<div>
				{editState.isEditingUserProfile ? (
					<UserProfileForm
						onCancel={handleCancelEditUserProfile}
						isSetup={false}
						userProfile={userProfile}
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
				<StatsErrorAlert
					errorMessage={statsErrorMsg?.message || '알 수 없는 오류'}
				/>
			)}
		</div>
	)
})

ProfilePageClient.displayName = 'ProfilePageClient'

export default ProfilePageClient
