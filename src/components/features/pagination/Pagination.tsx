import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { PaginationProps } from '@/types/notice'

export default function Pagination({
	currentPage,
	totalPages,
	basePath,
	className = '',
	extraParams = {},
}: PaginationProps) {
	if (totalPages <= 1) {
		return null
	}

	const getPageUrl = (page: number) => {
		const params = new URLSearchParams()

		Object.entries(extraParams).forEach(([key, value]) => {
			if (value && value !== 'all') {
				params.set(key, value)
			}
		})

		if (page > 1) {
			params.set('page', page.toString())
		}

		const queryString = params.toString()
		return queryString ? `${basePath}?${queryString}` : basePath
	}

	const getVisiblePages = () => {
		const pages: (number | string)[] = []
		const maxVisible = 5

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, '...', totalPages)
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					1,
					'...',
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages,
				)
			} else {
				pages.push(
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPages,
				)
			}
		}

		return pages
	}

	const visiblePages = getVisiblePages()

	const handlePageClick = () => {
		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		}, 100)
	}

	return (
		<nav
			className={`flex items-center justify-center space-x-2 ${className}`}
			aria-label="페이지네이션"
		>
			{/* 이전 페이지 버튼 */}
			{currentPage > 1 ? (
				<Link
					href={getPageUrl(currentPage - 1)}
					className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 backdrop-blur-xs shadow-xs hover:scale-105"
					aria-label="이전 페이지"
					onClick={handlePageClick}
				>
					<ChevronLeft size={16} />
				</Link>
			) : (
				<span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed backdrop-blur-xs shadow-xs">
					<ChevronLeft size={16} />
				</span>
			)}

			{/* 페이지 번호들 - 데스크톱에서만 표시 */}
			<div className="hidden sm:flex items-center space-x-1">
				{visiblePages.map((page, index) => {
					if (page === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className="flex items-center justify-center w-10 h-10 text-gray-400 dark:text-gray-500 font-medium"
							>
								...
							</span>
						)
					}

					const pageNumber = page as number
					const isActive = pageNumber === currentPage

					return isActive ? (
						<span
							key={pageNumber}
							className="flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-110 transition-all duration-200 backdrop-blur-xs ring-2 ring-emerald-200 dark:ring-emerald-800"
							aria-label={`현재 페이지 ${pageNumber}`}
							aria-current="page"
						>
							{pageNumber}
						</span>
					) : (
						<Link
							key={pageNumber}
							href={getPageUrl(pageNumber)}
							className="flex items-center justify-center w-10 h-10 rounded-full font-medium bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-200 dark:hover:border-emerald-700 shadow-xs hover:scale-105 transition-all duration-200 backdrop-blur-xs"
							aria-label={`페이지 ${pageNumber}`}
							onClick={handlePageClick}
						>
							{pageNumber}
						</Link>
					)
				})}
			</div>

			{/* 모바일용 페이지 정보 */}
			<div className="sm:hidden flex items-center justify-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 backdrop-blur-xs shadow-xs">
				<span className="text-emerald-600 dark:text-emerald-400 font-semibold">
					{currentPage}
				</span>
				<span className="mx-1 text-gray-400">/</span>
				<span>{totalPages}</span>
			</div>

			{/* 다음 페이지 버튼 */}
			{currentPage < totalPages ? (
				<Link
					href={getPageUrl(currentPage + 1)}
					className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 backdrop-blur-xs shadow-xs hover:scale-105"
					aria-label="다음 페이지"
					onClick={handlePageClick}
				>
					<ChevronRight size={16} />
				</Link>
			) : (
				<span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed backdrop-blur-xs shadow-xs">
					<ChevronRight size={16} />
				</span>
			)}
		</nav>
	)
}
