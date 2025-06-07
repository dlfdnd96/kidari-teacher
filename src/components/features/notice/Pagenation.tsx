import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	className?: string
}

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	className = '',
}: PaginationProps) => {
	if (totalPages <= 1) return null

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

	return (
		<div className={`flex items-center justify-center space-x-2 ${className}`}>
			{/* 이전 페이지 버튼 */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm shadow-sm"
				aria-label="이전 페이지"
			>
				<ChevronLeft size={16} />
			</button>

			{/* 페이지 번호들 - 데스크톱에서만 표시 */}
			<div className="hidden sm:flex items-center space-x-1">
				{visiblePages.map((page, index) => {
					if (page === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className="flex items-center justify-center w-10 h-10 text-gray-400 dark:text-gray-500"
							>
								...
							</span>
						)
					}

					const pageNumber = page as number
					const isActive = pageNumber === currentPage

					return (
						<button
							key={pageNumber}
							onClick={() => onPageChange(pageNumber)}
							className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all duration-200 backdrop-blur-sm ${
								isActive
									? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
									: 'bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm hover:scale-105'
							}`}
							aria-label={`페이지 ${pageNumber}`}
							aria-current={isActive ? 'page' : undefined}
						>
							{pageNumber}
						</button>
					)
				})}
			</div>

			{/* 모바일용 페이지 정보 */}
			<div className="sm:hidden flex items-center justify-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm text-gray-600 dark:text-gray-400 backdrop-blur-sm shadow-sm">
				{currentPage} / {totalPages}
			</div>

			{/* 다음 페이지 버튼 */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm shadow-sm"
				aria-label="다음 페이지"
			>
				<ChevronRight size={16} />
			</button>
		</div>
	)
}

export default Pagination
