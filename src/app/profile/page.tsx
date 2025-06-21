import React from 'react'
import { Metadata } from 'next'
import ProfilePageClient from '@/components/features/profile/ProfilePageClient'
import { User } from 'lucide-react'

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
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
			{/* 히어로 섹션 */}
			<section className="relative max-w-5xl mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8">
				{/* 배경 장식 */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />

				<div className="text-center">
					{/* 메인 아이콘 */}
					<div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 sm:mb-8 shadow-2xl">
						<User className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
					</div>

					{/* 제목 */}
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
						내 프로필
					</h1>

					{/* 구분선 */}
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4 sm:mb-6" />

					{/* 설명 */}
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
						내 정보를 관리하고 봉사활동 통계를 확인하세요
					</p>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<ProfilePageClient />
			</section>

			{/* 장식적 배경 요소 */}
			<div className="fixed top-1/4 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-2xl -z-10" />
			<div className="fixed bottom-1/4 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl -z-10" />
		</main>
	)
}
