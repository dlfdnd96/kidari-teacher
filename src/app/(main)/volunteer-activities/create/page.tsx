import React from 'react'
import { Metadata } from 'next'
import VolunteerActivityCreatePageClient from '@/components/features/volunteer-activities/VolunteerActivityCreatePageClient'

export const metadata: Metadata = {
	title: '봉사활동 생성 | 키다리 선생님',
	description: '새로운 봉사활동을 생성하여 참가자를 모집하세요.',
	keywords: ['봉사활동', '생성', '모집', '키다리선생님', '교육봉사'],
	openGraph: {
		title: '봉사활동 생성 | 키다리 선생님',
		description: '새로운 봉사활동을 생성하여 참가자를 모집하세요.',
		type: 'website',
		siteName: '키다리 선생님',
	},
	twitter: {
		card: 'summary_large_image',
		title: '봉사활동 생성 | 키다리 선생님',
		description: '새로운 봉사활동을 생성하여 참가자를 모집하세요.',
	},
}

export default function VolunteerActivityCreatePage() {
	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<section className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
				<VolunteerActivityCreatePageClient />
			</section>
		</main>
	)
}
