import React from 'react'
import { Metadata } from 'next'
import MyApplicationPageClient from '@/components/features/applications/MyApplicationPageClient'
import { FileText } from 'lucide-react'
import { MyApplicationsPageProps } from '@/types/application'
import { requireAuth } from '@/utils/auth'

export async function generateMetadata({
	searchParams,
}: MyApplicationsPageProps): Promise<Metadata> {
	const resolvedSearchParams = await searchParams
	const page = parseInt(resolvedSearchParams.page || '1', 10)

	return {
		title:
			page > 1
				? `내 신청 내역 (${page}페이지) | 키다리 선생님`
				: '내 신청 내역 | 키다리 선생님',
		description: '나의 봉사활동 신청 내역과 상태를 확인하세요.',
		keywords: ['신청내역', '봉사활동', '신청상태', '키다리선생님'],
		alternates: {
			canonical:
				page > 1 ? `/my-applications?page=${page}` : '/my-applications',
		},
		openGraph: {
			title: '내 신청 내역 | 키다리 선생님',
			description: '나의 봉사활동 신청 내역과 상태를 확인하세요.',
			type: 'website',
			siteName: '키다리 선생님',
		},
		twitter: {
			card: 'summary_large_image',
			title: '내 신청 내역 | 키다리 선생님',
			description: '나의 봉사활동 신청 내역과 상태를 확인하세요.',
		},
	}
}

export default async function MyApplicationsPage({
	searchParams,
}: MyApplicationsPageProps) {
	const resolvedSearchParams = await searchParams
	const pageParam = resolvedSearchParams.page
	const page = pageParam ? parseInt(pageParam, 10) : 1

	await requireAuth('/')

	return (
		<main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
			{/* 히어로 섹션 */}
			<section className="relative max-w-5xl mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8">
				{/* 배경 장식 */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />

				<div className="text-center">
					{/* 메인 아이콘 */}
					<div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 sm:mb-8 shadow-2xl">
						<FileText className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
					</div>

					{/* 제목 */}
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
						내 신청 내역
					</h1>

					{/* 구분선 */}
					<div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4 sm:mb-6" />

					{/* 설명 */}
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
						나의 봉사활동 신청 현황과 결과를 한눈에 확인하세요
					</p>
				</div>
			</section>

			{/* 사용자 안내 섹션 */}
			<section className="max-w-4xl mx-auto px-4 sm:px-8 mb-8">
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
					<div className="flex items-center gap-4">
						<div className="flex-shrink-0">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
								<FileText className="w-6 h-6 text-white" />
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
								신청 내역 안내
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								신청 상태는 실시간으로 업데이트됩니다. 대기 중인 신청은 활동
								시작 전까지 취소가 가능합니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<MyApplicationPageClient initialPage={page} />
			</section>

			{/* 장식적 배경 요소 */}
			<div className="fixed top-1/4 right-10 w-32 h-32 bg-linear-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-2xl -z-10" />
			<div className="fixed bottom-1/4 left-10 w-40 h-40 bg-linear-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl -z-10" />
		</main>
	)
}
