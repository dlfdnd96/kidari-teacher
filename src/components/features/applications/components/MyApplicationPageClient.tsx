'use client'

import React, { memo, Suspense, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { OctagonX, RefreshCw } from 'lucide-react'
import { MyApplicationList } from '@/components/features/applications/components'
import Pagination from '@/components/features/pagination/Pagination'
import { trpc } from '@/components/providers/TrpcProvider'
import { Button } from '@/components/ui/button'
import { keepPreviousData } from '@tanstack/react-query'
import {
	MyApplicationErrorStateProps,
	MyApplicationHeaderProps,
	MyApplicationLoadingIndicatorProps,
	MyApplicationPageClientProps,
	MyApplicationPaginationProps,
} from '@/types/application'

const LoadingSkeleton = memo(() => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
				</div>
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
			</div>
			<MyApplicationList applications={[]} isLoading={true} />
		</div>
	)
})

LoadingSkeleton.displayName = 'LoadingSkeleton'

const ErrorState = memo(({ onRetry }: MyApplicationErrorStateProps) => {
	return (
		<div className="text-center py-12" data-cy="error-state">
			<div className="flex justify-center mb-6">
				<OctagonX className="w-16 h-16 text-red-400 dark:text-red-500" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
				신청 내역을 불러올 수 없습니다
			</h3>
			<div className="flex justify-center">
				<Button
					onClick={onRetry}
					className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					data-cy="retry-button"
				>
					<RefreshCw className="w-4 h-4 mr-1.5" />
					<span>다시 시도</span>
				</Button>
			</div>
		</div>
	)
})

ErrorState.displayName = 'ErrorState'

const ApplicationHeader = memo(({ totalCount }: MyApplicationHeaderProps) => {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						신청 현황
					</h3>
				</div>
				<div
					className="text-sm text-gray-600 dark:text-gray-400"
					data-cy="total-count"
				>
					총 <span className="font-medium text-blue-600">{totalCount}</span>개
				</div>
			</div>
		</div>
	)
})

ApplicationHeader.displayName = 'ApplicationHeader'

const LoadingIndicator = memo(
	({ isFetching }: MyApplicationLoadingIndicatorProps) => {
		if (!isFetching) {
			return null
		}

		return (
			<div className="flex justify-center mb-4" data-cy="loading-indicator">
				<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
					<RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
					<span className="text-sm text-blue-600 dark:text-blue-400">
						로딩 중...
					</span>
				</div>
			</div>
		)
	},
)

LoadingIndicator.displayName = 'LoadingIndicator'

const ApplicationPagination = memo(
	({ applications, currentPage, totalPages }: MyApplicationPaginationProps) => {
		if (applications.length === 0 || totalPages <= 1) {
			return null
		}

		return (
			<div className="mt-8 sm:mt-12" data-cy="pagination">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					basePath="/my-applications"
					extraParams={{}}
				/>
			</div>
		)
	},
)

ApplicationPagination.displayName = 'ApplicationPagination'

function MyApplicationPageClientContent({
	initialPage = 1,
}: MyApplicationPageClientProps) {
	const searchParams = useSearchParams()

	const [currentPage, setCurrentPage] = useState(initialPage)
	const [isPageChanging, setIsPageChanging] = useState(false)

	const pageSize = 20

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
	}, [currentPage, searchParams])

	const {
		data: applicationData,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = trpc.application.getMyApplicationList.useQuery(
		{
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
			placeholderData: keepPreviousData,
		},
	)

	const applications = React.useMemo(() => {
		return applicationData?.myApplicationList ?? []
	}, [applicationData])

	const totalCount = applicationData?.totalCount || 0
	const totalPages = Math.ceil(totalCount / pageSize)

	useEffect(() => {
		if (!isLoading && totalPages > 0 && currentPage > totalPages) {
			notFound()
		}
	}, [isLoading, totalPages, currentPage])

	const showLoading = isLoading || isPageChanging

	if (showLoading) {
		return <LoadingSkeleton />
	}

	if (isError) {
		return <ErrorState onRetry={refetch} />
	}

	return (
		<>
			<ApplicationHeader totalCount={totalCount} />
			<LoadingIndicator isFetching={isFetching} />
			<MyApplicationList applications={applications} isLoading={false} />
			<ApplicationPagination
				applications={applications}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
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
