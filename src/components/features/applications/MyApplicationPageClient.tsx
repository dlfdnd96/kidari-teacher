'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import VolunteerActivityList from '@/components/features/volunteer-activities/VolunteerActivityList'
import Pagination from '@/components/features/pagination/Pagination'
import { ZodType } from '@/shared/types'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import type { VolunteerActivityPageClientProps } from '@/types/volunteer-activity'
import { CircleAlert, OctagonX, Plus, RefreshCw } from 'lucide-react'

const CreateVolunteerActivityModal = dynamic(
	() =>
		import(
			'@/components/features/volunteer-activities/CreateVolunteerActivityModal'
		),
	{
		ssr: false,
		loading: () => null,
	},
)

const VolunteerActivityDetailModal = dynamic(
	() =>
		import(
			'@/components/features/volunteer-activities/VolunteerActivityDetailModal'
		),
	{
		ssr: false,
		loading: () => null,
	},
)

// 신청 모달 동적 임포트 추가
const ApplicationModal = dynamic(
	() => import('@/components/features/applications/ApplicationModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

function VolunteerActivityPageClientContent({
	isAdmin,
	initialPage = 1,
}: VolunteerActivityPageClientProps) {
	const { data: session } = useSession()
	const searchParams = useSearchParams()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState<ZodType<
		typeof VolunteerActivityEntitySchema
	> | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)

	// 신청 모달 상태 추가
	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [applicationActivity, setApplicationActivity] = useState<ZodType<
		typeof VolunteerActivityEntitySchema
	> | null>(null)

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const pageSize = 10

	useEffect(() => {
		const pageFromUrl = parseInt(searchParams?.get('page') || '1', 10)
		if (pageFromUrl !== currentPage) {
			setIsPageChanging(true)
			setCurrentPage(pageFromUrl)

			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
				setIsPageChanging(false)
			}, 150)
		}
	}, [searchParams, currentPage])

	const {
		data: activityData,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = trpc.volunteerActivity.getVolunteerActivityList.useQuery(
		{
			filter: {
				// 필터 조건들을 여기에 추가할 수 있습니다
			},
			pageable: {
				offset: (currentPage - 1) * pageSize,
				limit: pageSize,
				sort: {
					createdAt: 'desc',
				},
			},
		},
		{
			staleTime: 60 * 1000,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			placeholderData: keepPreviousData,
		},
	)

	const activities = activityData?.volunteerActivityList || []
	const totalCount = activityData?.totalCount || activities.length
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const handleViewDetail = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			setSelectedActivity(activity)
			setIsDetailOpen(true)
		},
		[],
	)

	const handleCloseDetail = useCallback(() => {
		setIsDetailOpen(false)
		setSelectedActivity(null)
	}, [])

	// 신청 기능 추가
	const handleApply = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			if (!session?.user) {
				// 로그인이 필요한 경우 로그인 페이지로 리다이렉트
				window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
				return
			}

			setApplicationActivity(activity)
			setIsApplicationModalOpen(true)
		},
		[session],
	)

	const handleCloseApplicationModal = useCallback(() => {
		setIsApplicationModalOpen(false)
		setApplicationActivity(null)
	}, [])

	const showLoading = isLoading || isPageChanging || isFetching

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 봉사활동 목록 스켈레톤 */}
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
							{isAdmin && (
								<div className="flex gap-2">
									<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
									<div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
								</div>
							)}
						</div>
						<div className="space-y-2 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
						</div>
						<div className="space-y-2 mb-4">
							{[1, 2, 3, 4, 5].map((j) => (
								<div key={j} className="flex items-center gap-2">
									<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
								</div>
							))}
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
							<div className="flex items-center">
								<div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
							</div>
							<div className="flex items-center">
								<div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
					</div>
				))}

				{/* 페이지네이션 스켈레톤 */}
				<div className="flex items-center justify-center space-x-2 mt-8">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
					<div className="hidden sm:flex space-x-1">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
							/>
						))}
					</div>
					<div className="sm:hidden w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<OctagonX className="w-16 h-16 text-red-400 dark:text-red-500" />
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					봉사활동을 불러올 수 없습니다
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-4">
					{error?.message || '네트워크 오류가 발생했습니다.'}
				</p>
				<div className="flex justify-center">
					<Button
						onClick={() => refetch()}
						className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
					>
						<RefreshCw className="w-4 h-4 mr-1.5" />
						<span>다시 시도</span>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			{/* 봉사활동 목록 */}
			<VolunteerActivityList
				activities={activities}
				onViewDetail={handleViewDetail}
				onApply={handleApply}
				currentUserId={session?.user?.id}
				userRole={session?.user?.role as 'USER' | 'ADMIN'}
				totalCount={totalCount}
			/>

			{/* 페이지네이션 */}
			{activities.length > 0 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/volunteer-activities"
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{activities.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						아직 등록된 봉사활동이 없습니다
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{isAdmin
							? '첫 번째 봉사활동을 생성해보세요!'
							: '새로운 봉사활동을 기다려주세요.'}
					</p>
				</div>
			)}

			{/* 오른쪽 하단 플로팅 +버튼 (관리자만) */}
			{isAdmin && !isDetailOpen && (
				<button
					onClick={handleOpenModal}
					aria-label="봉사활동 생성"
					className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer"
				>
					<Plus className="w-8 h-8" />
				</button>
			)}

			{/* 동적으로 로드되는 모달들 */}
			<CreateVolunteerActivityModal
				open={isModalOpen}
				onClose={handleCloseModal}
			/>
			<VolunteerActivityDetailModal
				open={isDetailOpen}
				onClose={handleCloseDetail}
				activity={selectedActivity}
				onApply={handleApply}
				currentUserId={session?.user?.id}
				userRole={session?.user?.role as 'USER' | 'ADMIN'}
			/>

			{/* 신청 모달 추가 */}
			{applicationActivity && (
				<ApplicationModal
					open={isApplicationModalOpen}
					onClose={handleCloseApplicationModal}
					volunteerActivityId={applicationActivity.id}
					volunteerActivityTitle={applicationActivity.title}
				/>
			)}
		</>
	)
}

export default function VolunteerActivityPageClient({
	isAdmin,
	initialPage,
}: VolunteerActivityPageClientProps) {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<VolunteerActivityPageClientContent
				isAdmin={isAdmin}
				initialPage={initialPage}
			/>
		</Suspense>
	)
}
