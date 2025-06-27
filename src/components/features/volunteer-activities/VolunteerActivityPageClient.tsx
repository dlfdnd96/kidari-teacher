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
import { VolunteerActivityPageClientProps } from '@/types/volunteer-activity'
import { CircleAlert, OctagonX, Plus, RefreshCw } from 'lucide-react'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { Enum } from '@/enums'

const ApplicationModal = dynamic(
	() => import('@/components/features/applications/ApplicationModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

function VolunteerActivityPageClientContent({
	initialPage = 1,
}: VolunteerActivityPageClientProps) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const { showError } = useErrorModal()
	const { data: session } = useSession()

	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [applicationActivity, setApplicationActivity] = useState<ZodType<
		typeof VolunteerActivityEntitySchema
	> | null>(null)

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all')
	const [searchQuery, setSearchQuery] = useState('')

	const urlUpdateTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const pageSize = 12
	const isAdmin = session?.user?.role === Enum.Role.ADMIN

	useEffect(() => {
		const statusFromUrl = searchParams?.get('status') || 'all'
		const pageFromUrl = parseInt(searchParams?.get('page') || '1', 12)
		const searchFromUrl = searchParams?.get('search') || ''

		setSelectedStatus(statusFromUrl)
		setSearchQuery(searchFromUrl)

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
	}, [currentPage, searchParams])

	const {
		data: volunteerActivityData,
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
			filter: {
				...(selectedStatus !== 'all' && { status: selectedStatus }),
				...(searchQuery.trim() && {
					search: searchQuery.trim(),
				}),
			},
		},
		{
			staleTime: 60 * 1000,
			refetchOnWindowFocus: false,
			placeholderData: keepPreviousData,
		},
	)

	const volunteerActivities = React.useMemo(() => {
		if (!volunteerActivityData?.volunteerActivityList) {
			return []
		}

		let activities = volunteerActivityData.volunteerActivityList

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim()
			activities = activities.filter(
				(activity) =>
					activity.title.toLowerCase().includes(query) ||
					activity.description.toLowerCase().includes(query),
			)
		}

		return activities
	}, [volunteerActivityData, searchQuery])

	const totalCount = volunteerActivityData?.totalCount || 0
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const handleCreateActivity = useCallback(() => {
		if (typeof window !== 'undefined') {
			const currentFilters = {
				status: selectedStatus !== 'all' ? selectedStatus : undefined,
				search: searchQuery.trim() || undefined,
				page: currentPage > 1 ? currentPage : undefined,
			}
			sessionStorage.setItem(
				'volunteer-activities-filters',
				JSON.stringify(currentFilters),
			)
		}
		router.push('/volunteer-activities/create')
	}, [router, selectedStatus, searchQuery, currentPage])

	const handleViewDetail = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			if (typeof window !== 'undefined') {
				const currentFilters = {
					status: selectedStatus !== 'all' ? selectedStatus : undefined,
					search: searchQuery.trim() || undefined,
					page: currentPage > 1 ? currentPage : undefined,
				}
				sessionStorage.setItem(
					'volunteer-activities-filters',
					JSON.stringify(currentFilters),
				)
			}
			router.push(`/volunteer-activities/${activity.id}`)
		},
		[router, selectedStatus, searchQuery, currentPage],
	)

	const handleApply = useCallback(
		(activity: ZodType<typeof VolunteerActivityEntitySchema>) => {
			if (!session?.user) {
				handleClientError(
					CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
					showError,
					'인증 오류',
				)
				return
			}

			setApplicationActivity(activity)
			setIsApplicationModalOpen(true)
		},
		[session?.user, showError],
	)

	const utils = trpc.useUtils()

	const handleCloseApplicationModal = useCallback(() => {
		setIsApplicationModalOpen(false)
		setApplicationActivity(null)
	}, [])

	const handleApplicationSuccess = useCallback(async () => {
		await Promise.all([
			utils.volunteerActivity.getVolunteerActivityList.invalidate(),
			utils.application.getApplicationList.invalidate(),
		])
	}, [utils])

	const updateURLImmediate = useCallback(
		(params: { status?: string; page?: number; search?: string }) => {
			const urlParams = new URLSearchParams()

			if (params.status && params.status !== 'all') {
				urlParams.set('status', params.status)
			}
			if (params.page && params.page > 1) {
				urlParams.set('page', params.page.toString())
			}
			if (params.search && params.search.trim()) {
				urlParams.set('search', params.search.trim())
			}

			const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : ''
			router.replace(`/volunteer-activities${newUrl}`, { scroll: false })
		},
		[router],
	)

	const updateURL = useCallback(
		(params: { status?: string; page?: number; search?: string }) => {
			if (urlUpdateTimeoutRef.current) {
				clearTimeout(urlUpdateTimeoutRef.current)
			}

			const delay = params.search !== undefined ? 500 : 0

			urlUpdateTimeoutRef.current = setTimeout(() => {
				const urlParams = new URLSearchParams()

				if (params.status && params.status !== 'all') {
					urlParams.set('status', params.status)
				}
				if (params.page && params.page > 1) {
					urlParams.set('page', params.page.toString())
				}
				if (params.search && params.search.trim()) {
					urlParams.set('search', params.search.trim())
				}

				const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : ''

				router.replace(`/volunteer-activities${newUrl}`, { scroll: false })
			}, delay)
		},
		[router],
	)

	const handleStatusChange = useCallback(
		(status: string | 'all') => {
			setSelectedStatus(status)
			setCurrentPage(1)
			updateURL({
				status: status,
				page: 1,
				search: searchQuery || undefined,
			})
		},
		[searchQuery, updateURL],
	)

	const handleSearchChange = useCallback(
		(query: string) => {
			setSearchQuery(query)
			setCurrentPage(1)

			updateURLImmediate({
				status: selectedStatus !== 'all' ? selectedStatus : undefined,
				page: 1,
				search: query,
			})
		},
		[selectedStatus, updateURLImmediate],
	)

	useEffect(() => {
		return () => {
			if (urlUpdateTimeoutRef.current) {
				clearTimeout(urlUpdateTimeoutRef.current)
			}
		}
	}, [])

	const showLoading = isLoading || isPageChanging

	if (showLoading) {
		return (
			<div className="space-y-6">
				{/* 검색 및 필터 스켈레톤 */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
						</div>
					</div>

					{/* 검색바 스켈레톤 */}
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />

					{/* 필터 버튼들 스켈레톤 */}
					<div className="space-y-3">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
						<div className="flex flex-wrap gap-3">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"
								/>
							))}
						</div>
					</div>
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
						<div className="mt-4 flex gap-2">
							<div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
					</div>
				))}
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
						variant="outline"
						className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
					>
						<RefreshCw className="w-4 h-4" />
						<span>다시 시도</span>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			{/* 헤더 영역 - 생성 버튼과 검색/필터 */}
			<div className="mb-8">
				{/* 우측 상단 생성 버튼 */}
				{isAdmin && (
					<div className="flex justify-end mb-4">
						<Button
							onClick={handleCreateActivity}
							variant="outline"
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
						>
							<Plus className="w-4 h-4" />
							<span>봉사활동 생성</span>
						</Button>
					</div>
				)}

				{/* 검색/필터 영역 */}
				<VolunteerActivityFilterTab
					selectedStatus={selectedStatus}
					statusChangeAction={handleStatusChange}
					searchQuery={searchQuery}
					searchChangeAction={handleSearchChange}
				/>
			</div>

			{/* 로딩 인디케이터 (검색 중일 때만 작은 표시) */}
			{isFetching && (
				<div className="flex justify-center mb-4">
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
						<RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
						<span className="text-sm text-emerald-600 dark:text-emerald-400">
							검색 중...
						</span>
					</div>
				</div>
			)}

			{/* 봉사활동 목록 */}
			<VolunteerActivityList
				activities={volunteerActivities}
				onViewDetail={handleViewDetail}
				onApply={handleApply}
				totalCount={totalCount}
			/>

			{/* 페이지네이션 */}
			{volunteerActivities.length > 0 && totalPages > 1 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/volunteer-activities"
						extraParams={{
							...(selectedStatus !== 'all' && { status: selectedStatus }),
							...(searchQuery.trim() && { search: searchQuery.trim() }),
						}}
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{volunteerActivities.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{searchQuery.trim()
							? `"${searchQuery}" 검색 결과가 없습니다`
							: selectedStatus === 'all'
								? '아직 등록된 봉사활동이 없습니다'
								: '해당 조건의 봉사활동이 없습니다'}
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{searchQuery.trim()
							? '다른 검색어를 입력하거나 필터를 변경해보세요.'
							: isAdmin
								? selectedStatus === 'all'
									? '첫 번째 봉사활동을 생성해보세요!'
									: '다른 상태로 전환하거나 새로운 봉사활동을 생성해보세요.'
								: selectedStatus === 'all'
									? '새로운 봉사활동을 기다려주세요.'
									: '다른 상태의 봉사활동을 확인해보세요.'}
					</p>
				</div>
			)}

			{/* 신청 모달 */}
			{applicationActivity && (
				<ApplicationModal
					open={isApplicationModalOpen}
					onClose={handleCloseApplicationModal}
					volunteerActivityId={applicationActivity.id}
					volunteerActivityTitle={applicationActivity.title}
					onSuccess={handleApplicationSuccess}
				/>
			)}
		</>
	)
}

export default function VolunteerActivityPageClient({
	initialPage,
}: VolunteerActivityPageClientProps) {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<VolunteerActivityPageClientContent initialPage={initialPage} />
		</Suspense>
	)
}
