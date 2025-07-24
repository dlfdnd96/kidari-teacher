'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ProfileSetupForm } from '@/components/features/profile/components'

export default function ProfileSetupPage() {
	const { status } = useSession()
	const router = useRouter()

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2" />
					<p className="text-gray-600 dark:text-gray-400">
						페이지를 불러오는 중...
					</p>
				</div>
			</div>
		)
	}

	if (status === 'unauthenticated') {
		router.push('/')
		return null
	}

	return (
		<div className="min-h-screen" data-cy="profile-setup-page">
			<main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
				<section className="p-6 sm:p-8" aria-labelledby="profile-setup-title">
					{/* 헤더 */}
					<header className="mb-8">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1 min-w-0">
								<h1
									id="profile-setup-title"
									className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3"
								>
									프로필 설정
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									원활한 서비스 이용을 위해 필요한 정보를 입력해주세요
								</p>
							</div>
						</div>
						<div
							className="border-b border-gray-200 dark:border-gray-700"
							aria-hidden="true"
						/>
					</header>

					{/* 프로필 설정 폼 */}
					<ProfileSetupForm />

					{/* 안내 텍스트 */}
					<footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
						<p className="text-center text-sm text-gray-500 dark:text-gray-400">
							언제든지 프로필 설정에서 정보를 수정할 수 있습니다.
						</p>
					</footer>
				</section>
			</main>
		</div>
	)
}
