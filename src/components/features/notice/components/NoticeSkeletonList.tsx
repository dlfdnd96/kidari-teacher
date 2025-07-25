import React, { memo } from 'react'
import {
	NoticeSkeletonCardProps,
	NoticeSkeletonListProps,
} from '@/types/notice'

const skeletonBaseClass = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse'

const NoticeSkeletonHeader = memo(() => (
	<div className="space-y-6">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<div className={`w-5 h-5 ${skeletonBaseClass}`} />
				<div className={`h-6 w-40 ${skeletonBaseClass}`} />
			</div>
		</div>

		{/* 생성 버튼 스켈레톤 */}
		<div className="flex justify-end">
			<div className={`h-12 w-32 rounded-xl ${skeletonBaseClass}`} />
		</div>
	</div>
))

NoticeSkeletonHeader.displayName = 'NoticeSkeletonHeader'

const NoticeSkeletonCard = memo(({ index = 0 }: NoticeSkeletonCardProps) => (
	<div
		className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 animate-pulse"
		style={{
			animationDelay: `${index * 100}ms`,
		}}
		aria-hidden="true"
	>
		<div className="flex items-start justify-between mb-4">
			<div className="flex-1 space-y-3">
				{/* 제목 스켈레톤 */}
				<div className={`h-6 w-3/4 ${skeletonBaseClass}`} />

				{/* 내용 미리보기 스켈레톤 */}
				<div className="space-y-2">
					<div className={`h-4 w-full ${skeletonBaseClass}`} />
					<div className={`h-4 w-2/3 ${skeletonBaseClass}`} />
				</div>

				{/* 메타 정보 스켈레톤 */}
				<div className="flex gap-4 pt-2">
					<div className={`h-4 w-20 ${skeletonBaseClass}`} />
					<div className={`h-4 w-24 ${skeletonBaseClass}`} />
				</div>
			</div>
		</div>
	</div>
))

NoticeSkeletonCard.displayName = 'NoticeSkeletonCard'

const NoticeSkeletonPagination = memo(() => (
	<div
		className="flex items-center justify-center space-x-2"
		aria-hidden="true"
	>
		{/* 이전 버튼 */}
		<div className={`w-10 h-10 rounded ${skeletonBaseClass}`} />

		{/* 데스크톱 페이지 번호들 */}
		<div className="hidden sm:flex space-x-1">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className={`w-10 h-10 rounded ${skeletonBaseClass}`} />
			))}
		</div>

		{/* 모바일 페이지 정보 */}
		<div className={`sm:hidden w-16 h-8 rounded ${skeletonBaseClass}`} />

		{/* 다음 버튼 */}
		<div className={`w-10 h-10 rounded ${skeletonBaseClass}`} />
	</div>
))

NoticeSkeletonPagination.displayName = 'NoticeSkeletonPagination'

const NoticeSkeletonList = memo(
	({
		count = 3,
		showHeader = true,
		showPagination = true,
	}: NoticeSkeletonListProps) => {
		return (
			<div
				className="space-y-6"
				role="status"
				aria-label="공지사항을 불러오는 중입니다"
			>
				{/* 헤더 스켈레톤 */}
				{showHeader && <NoticeSkeletonHeader />}

				{/* 공지사항 목록 스켈레톤 */}
				<div className="space-y-4">
					{Array.from({ length: count }).map((_, index) => (
						<NoticeSkeletonCard key={index} index={index} />
					))}
				</div>

				{/* 페이지네이션 스켈레톤 */}
				{showPagination && <NoticeSkeletonPagination />}

				{/* 스크린 리더를 위한 로딩 상태 */}
				<div className="sr-only" aria-live="polite">
					공지사항 목록을 불러오고 있습니다. 잠시만 기다려 주세요.
				</div>
			</div>
		)
	},
)

NoticeSkeletonList.displayName = 'NoticeSkeletonList'

export default NoticeSkeletonList
