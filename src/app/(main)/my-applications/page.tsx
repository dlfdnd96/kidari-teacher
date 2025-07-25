import React from 'react'
import { Metadata } from 'next'
import { MyApplicationPageClient } from '@/components/features/applications/components'
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
			<section className="max-w-4xl mx-auto px-4 sm:px-8 mb-6">
				<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
					<div className="flex items-center gap-2">
						<FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
						<span className="text-blue-800 dark:text-blue-200 text-sm">
							대기 중인 신청은 활동시작 전까지 취소가 가능합니다.
						</span>
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
