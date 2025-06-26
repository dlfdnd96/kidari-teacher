import React from 'react'
import { Metadata } from 'next'
import VolunteerActivityPageClient from '@/components/features/volunteer-activities/VolunteerActivityPageClient'
import { VolunteerActivitiesPageProps } from '@/types/volunteer-activity'

export async function generateMetadata({
	searchParams,
}: VolunteerActivitiesPageProps): Promise<Metadata> {
	const resolvedSearchParams = await searchParams
	const page = parseInt(resolvedSearchParams.page || '1', 10)

	return {
		title:
			page > 1
				? `봉사활동 (${page}페이지) | 키다리 선생님`
				: '봉사활동 | 키다리 선생님',
		description: '다양한 봉사활동에 참여하여 의미있는 경험을 쌓아보세요.',
		keywords: ['봉사활동', '자원봉사', '사회봉사', '키다리선생님', '교육봉사'],
		alternates: {
			canonical:
				page > 1
					? `/volunteer-activities?page=${page}`
					: '/volunteer-activities',
		},
		openGraph: {
			title: '봉사활동 | 키다리 선생님',
			description: '다양한 봉사활동에 참여하여 의미있는 경험을 쌓아보세요.',
			type: 'website',
			siteName: '키다리 선생님',
		},
		twitter: {
			card: 'summary_large_image',
			title: '봉사활동 | 키다리 선생님',
			description: '다양한 봉사활동에 참여하여 의미있는 경험을 쌓아보세요.',
		},
	}
}

export default async function VolunteerActivitiesPage({
	searchParams,
}: VolunteerActivitiesPageProps) {
	const resolvedSearchParams = await searchParams
	const pageParam = resolvedSearchParams.page
	const page = pageParam ? parseInt(pageParam, 10) : 1

	return (
		<main className="min-h-screen bg-white dark:bg-gray-900">
			{/* 컨텐츠 섹션 */}
			<section className="max-w-6xl mx-auto py-6 px-6 sm:px-6">
				<VolunteerActivityPageClient initialPage={page} />
			</section>
		</main>
	)
}
