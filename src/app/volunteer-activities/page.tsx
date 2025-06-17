import React from 'react'
import { Metadata } from 'next'
import { Enum } from '@/enums'
import VolunteerActivityPageClient from '@/components/features/volunteer-activities/VolunteerActivityPageClient'
import { Heart } from 'lucide-react'
import { VolunteerActivitiesPageProps } from '@/types/volunteer-activity'
import { requireAuth } from '@/utils/auth'

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

	const session = await requireAuth('/')
	const isAdmin = session.user.email
		? session.user.role === Enum.Role.ADMIN
		: false

	return (
		<main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
			{/* 히어로 섹션 */}
			<section className="relative max-w-5xl mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8">
				{/* 배경 장식 */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-linear-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -z-10" />

				<div className="text-center">
					{/* 메인 아이콘 */}
					<div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-linear-to-r from-emerald-500 to-teal-600 rounded-full mb-6 sm:mb-8 shadow-2xl">
						<Heart className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
					</div>

					{/* 제목 */}
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
						봉사활동
					</h1>

					{/* 구분선 */}
					<div className="w-20 h-1 bg-linear-to-r from-emerald-500 to-teal-600 mx-auto rounded-full mb-4 sm:mb-6" />

					{/* 설명 */}
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
						의미있는 봉사활동에 참여하여 함께 성장하고 세상을 변화시켜 나가요
					</p>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<VolunteerActivityPageClient isAdmin={isAdmin} initialPage={page} />
			</section>

			{/* 장식적 배경 요소 */}
			<div className="fixed top-1/4 right-10 w-32 h-32 bg-linear-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-2xl -z-10" />
			<div className="fixed bottom-1/4 left-10 w-40 h-40 bg-linear-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl -z-10" />
		</main>
	)
}
