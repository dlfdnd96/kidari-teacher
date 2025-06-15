import React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfilePageClient from '@/components/features/profile/ProfilePageClient'
import { User, Settings, TrendingUp, Heart } from 'lucide-react'
import { Enum } from '@/enums'

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
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		redirect('/')
	}

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

					{/* 기능 소개 */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
						<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
							<div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto mb-3">
								<User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
								정보
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								프로필 정보 관리
							</div>
						</div>

						<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50">
							<div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-auto mb-3">
								<TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
								통계
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								활동 통계 확인
							</div>
						</div>

						<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
							<div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mx-auto mb-3">
								<Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
							</div>
							<div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
								설정
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								계정 설정 관리
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 사용자 환영 메시지 */}
			<section className="max-w-4xl mx-auto px-4 sm:px-8 mb-8">
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
					<div className="flex items-center gap-4">
						<div className="flex-shrink-0">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
								<Heart className="w-6 h-6 text-white" />
							</div>
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
								환영합니다, {session.user.name}님!
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								프로필 정보를 최신 상태로 유지하여 더 나은 봉사활동 경험을
								만들어보세요.
							</p>
						</div>
						<div className="flex-shrink-0">
							<div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
								{session.user.role === Enum.Role.ADMIN ? '관리자' : '사용자'}
							</div>
						</div>
					</div>
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
