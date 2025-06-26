import React from 'react'
import { Metadata } from 'next'
import MyApplicationPageClient from '@/components/features/applications/MyApplicationPageClient'
import { FileText } from 'lucide-react'
import { MyApplicationsPageProps } from '@/types/application'

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

	return (
		<main className="min-h-screen pt-16">
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
								대기 중인 신청은 활동시작 전까지 취소가 가능합니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<MyApplicationPageClient initialPage={page} />
			</section>
		</main>
	)
}
