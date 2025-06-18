'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import MyApplicationList from '@/components/features/applications/MyApplicationList'
import Pagination from '@/components/features/pagination/Pagination'
import { ZodType } from '@/shared/types'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import type { MyApplicationPageClientProps } from '@/types/application'
import { CircleAlert, OctagonX, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'

const ApplicationDetailModal = dynamic(
	() => import('@/components/features/applications/ApplicationDetailModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

function MyApplicationPageClientContent({
	initialPage = 1,
}: MyApplicationPageClientProps) {
	const { data: session } = useSession()
	const searchParams = useSearchParams()

	const [selectedApplication, setSelectedApplication] = useState<ZodType<
		typeof ApplicationEntitySchema
	> | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)

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
		data: applicationData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.application.getMyApplicationList.useQuery(
		{
			filter: {
				userId: session?.user?.id,
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

	const applications = applicationData?.myApplicationList || []
	const totalCount = applicationData?.totalCount || applications.length
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const handleViewDetail = useCallback(
		(application: ZodType<typeof ApplicationEntitySchema>) => {
			setSelectedApplication(application)
			setIsDetailOpen(true)
		},
		[],
	)

	const handleCloseDetail = useCallback(() => {
		setIsDetailOpen(false)
		setSelectedApplication(null)
	}, [])

	const showLoading = isLoading || isPageChanging || isFetching

	if (showLoading) {
		return <MyApplicationList applications={[]} isLoading={true} />
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<OctagonX className="w-16 h-16 text-red-400 dark:text-red-500" />
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					신청 내역을 불러올 수 없습니다
				</h3>
				<div className="flex justify-center">
					<Button
						onClick={() => refetch()}
						className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
			{/* 내 신청 목록 */}
			<MyApplicationList
				applications={applications}
				onViewDetail={handleViewDetail}
				isLoading={false}
			/>

			{/* 페이지네이션 */}
			{applications.length > 0 && (
				<div className="mt-8 sm:mt-12">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/my-applications"
					/>
				</div>
			)}

			{/* 빈 상태 표시 */}
			{applications.length === 0 && (
				<div className="text-center py-12">
					<div className="flex justify-center mb-6">
						<CircleAlert className="w-16 h-16 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						아직 신청한 봉사활동이 없습니다
					</h3>
					<p className="text-gray-500 dark:text-gray-400 mb-6">
						관심있는 봉사활동에 신청해보세요!
					</p>
					<Button
						onClick={() => (window.location.href = '/volunteer-activities')}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					>
						봉사활동 둘러보기
					</Button>
				</div>
			)}

			{selectedApplication && (
				<ApplicationDetailModal
					open={isDetailOpen}
					onClose={handleCloseDetail}
					application={selectedApplication}
					userRole={session?.user?.role}
				/>
			)}
		</>
	)
}

export default function MyApplicationPageClient({
	initialPage,
}: MyApplicationPageClientProps) {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<MyApplicationPageClientContent initialPage={initialPage} />
		</Suspense>
	)
}
