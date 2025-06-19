'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import VolunteerActivityList from '@/components/features/volunteer-activities/VolunteerActivityList'
import VolunteerActivityFilterTab from '@/components/features/volunteer-activities/VolunteerActivityFilterTab'
import Pagination from '@/components/features/pagination/Pagination'
import { ZodType } from '@/shared/types'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import {
	VOLUNTEER_ACTIVITY_STATUS_PRIORITY,
	VolunteerActivityPageClientProps,
} from '@/types/volunteer-activity'
import { CircleAlert, OctagonX, Plus, RefreshCw } from 'lucide-react'
import { ERROR_MESSAGES, handleClientError } from '@/utils/error'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'

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
	const searchParams = useSearchParams()
	const router = useRouter()
	const { showError } = useErrorModal()

	const { data: session } = useSession()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState<ZodType<
		typeof VolunteerActivityEntitySchema
	> | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)
	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [applicationActivity, setApplicationActivity] = useState<ZodType<
		typeof VolunteerActivityEntitySchema
	> | null>(null)

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all')
	const pageSize = 10

	useEffect(() => {
		const statusFromUrl = searchParams?.get('status') || 'all'
		const pageFromUrl = parseInt(searchParams?.get('page') || '1', 10)

		if (statusFromUrl !== selectedStatus) {
			setSelectedStatus(statusFromUrl)
		}

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
	}, [searchParams, currentPage, selectedStatus])

	const { data: allActivitiesData } =
		trpc.volunteerActivity.getVolunteerActivityList.useQuery(
			{
				pageable: {
					offset: 0,
					limit: 100,
					sort: {
						startAt: 'asc',
					},
				},
			},
			{
				staleTime: 5 * 60 * 1000,
				refetchOnWindowFocus: false,
			},
		)

	const {
		data: activityData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.volunteerActivity.getVolunteerActivityList.useQuery(
		{
			pageable: {
				offset: (currentPage - 1) * pageSize,
				limit: pageSize,
				sort: {
					startAt: 'asc',
				},
			},
			filter: selectedStatus !== 'all' ? { status: selectedStatus } : undefined,
		},
		{
			staleTime: 60 * 1000,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			placeholderData: keepPreviousData,
		},
	)

	const statusCounts = React.useMemo(() => {
		if (!allActivitiesData?.volunteerActivityList) {
			return []
		}

		const counts = allActivitiesData.volunteerActivityList.reduce(
			(acc, activity) => {
				acc[activity.status] = (acc[activity.status] || 0) + 1
				return acc
			},
			{} as Record<string, number>,
		)

		return Object.entries(counts).map(([status, count]) => ({
			status,
			count,
		}))
	}, [allActivitiesData])

	const sortedActivities = React.useMemo(() => {
		if (!activityData?.volunteerActivityList) {
			return []
		}

		if (selectedStatus === 'all') {
			return [...activityData.volunteerActivityList].sort((a, b) => {
				const priorityA = VOLUNTEER_ACTIVITY_STATUS_PRIORITY[a.status] || 999
				const priorityB = VOLUNTEER_ACTIVITY_STATUS_PRIORITY[b.status] || 999

				if (priorityA !== priorityB) {
					return priorityA - priorityB
				}

				return a.startAt.getTime() - b.startAt.getTime()
			})
		}

		return activityData.volunteerActivityList
	}, [activityData, selectedStatus])

	const totalCount = activityData?.totalCount || sortedActivities.length
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

	const handleApply = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			if (!session?.user) {
				handleClientError(
					ERROR_MESSAGES.AUTHENTICATION_ERROR,
					showError,
					'인증 오류',
				)
				return
			}

			setApplicationActivity(activity)
			setIsApplicationModalOpen(true)
			setIsDetailOpen(false)
		},
		[session?.user, showError],
	)

	const handleCloseApplicationModal = useCallback(() => {
		setIsApplicationModalOpen(false)
		setApplicationActivity(null)
	}, [])

	const handleApplyFromDetail = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			handleApply(activity)
		},
		[handleApply],
	)

	const handleStatusChange = useCallback(
		(status: string | 'all') => {
			setSelectedStatus(status)
			setCurrentPage(1)

			const params = new URLSearchParams()
			if (status !== 'all') {
				params.set('status', status)
			}
			params.set('page', '1')

			const newUrl = params.toString() ? `?${params.toString()}` : ''
			router.push(`/volunteer-activities${newUrl}`, { scroll: false })
		},
		[router],
	)

	const showLoading = isLoading || isPageChanging || isFetching

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 필터 탭 스켈레톤 */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
					</div>
					<div className="flex flex-wrap gap-3">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"
							/>
						))}
					</div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
				</div>

				{/* 봉사활동 목록 스켈레톤 */}
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
			{/* 필터 탭 */}
			<div className="mb-8">
				<VolunteerActivityFilterTab
					selectedStatus={selectedStatus}
					onStatusChange={handleStatusChange}
					statusCounts={statusCounts}
				/>
			</div>

			{/* 봉사활동 목록 */}
			<VolunteerActivityList
				activities={sortedActivities}
				onViewDetail={handleViewDetail}
				onApply={handleApply}
				totalCount={totalCount}
			/>

			{/* 페이지네이션 */}
			{sortedActivities.length > 0 && totalPages > 1 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/volunteer-activities"
						extraParams={
							selectedStatus !== 'all' ? { status: selectedStatus } : {}
						}
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{sortedActivities.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{selectedStatus === 'all'
							? '아직 등록된 봉사활동이 없습니다'
							: `${
									statusCounts.find((s) => s.status === selectedStatus)
										?.count === 0
										? '해당 상태의 봉사활동이 없습니다'
										: '봉사활동이 없습니다'
								}`}
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{isAdmin
							? selectedStatus === 'all'
								? '첫 번째 봉사활동을 생성해보세요!'
								: '다른 상태로 전환하거나 새로운 봉사활동을 생성해보세요.'
							: selectedStatus === 'all'
								? '새로운 봉사활동을 기다려주세요.'
								: '다른 상태의 봉사활동을 확인해보세요.'}
					</p>
				</div>
			)}

			{/* 오른쪽 하단 플로팅 +버튼 (관리자만) */}
			{isAdmin && !isDetailOpen && !isApplicationModalOpen && (
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

			{selectedActivity && (
				<VolunteerActivityDetailModal
					open={isDetailOpen}
					onClose={handleCloseDetail}
					activity={selectedActivity}
					onApply={handleApplyFromDetail}
				/>
			)}

			{/* 신청 모달 */}
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
