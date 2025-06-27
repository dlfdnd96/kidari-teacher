import React from 'react'
import { Metadata } from 'next'
import ProfilePageClient from '@/components/features/profile/ProfilePageClient'

export const metadata: Metadata = {
	title: '프로필 | 키다리 선생님',
	description: '내 프로필 정보와 활동 통계를 확인하고 설정을 관리하세요.',
	keywords: ['프로필', '설정', '활동통계', '키다리선생님'],
	openGraph: {
		title: '프로필 | 키다리 선생님',
		description: '내 프로필 정보와 활동 통계를 확인하고 설정을 관리하세요.',
		type: 'website',
		siteName: '키다리 선생님',
	},
	twitter: {
		card: 'summary_large_image',
		title: '프로필 | 키다리 선생님',
		description: '내 프로필 정보와 활동 통계를 확인하고 설정을 관리하세요.',
	},
}

export default async function ProfilePage() {
	return (
		<main className="min-h-screen pt-16">
			<div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<ProfilePageClient />
			</div>
		</main>
	)
}
