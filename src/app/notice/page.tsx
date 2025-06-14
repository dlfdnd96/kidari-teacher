import React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Enum } from '@/enums'
import NoticePageClient from '@/components/features/notice/NoticePageClient'
import { NoticePageProps } from '@/types/notice'

export async function generateMetadata({
	searchParams,
}: NoticePageProps): Promise<Metadata> {
	const resolvedSearchParams = await searchParams
	const page = parseInt(resolvedSearchParams.page || '1', 10)

	return {
		title:
			page > 1
				? `공지사항 (${page}페이지) | 키다리 선생님`
				: '공지사항 | 키다리 선생님',
		description: '키다리 선생님의 최신 공지사항을 확인하세요.',
		alternates: {
			canonical: page > 1 ? `/notice?page=${page}` : '/notice',
		},
		openGraph: {
			title: '공지사항 | 키다리 선생님',
			description: '키다리 선생님의 최신 공지사항을 확인하세요.',
			type: 'website',
		},
	}
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
	const resolvedSearchParams = await searchParams
	const pageParam = resolvedSearchParams.page
	const page = pageParam ? parseInt(pageParam, 10) : 1

	if (pageParam && (isNaN(page) || page < 1)) {
		notFound()
	}

	const session = await getServerSession(authOptions)
	const isAdmin = session?.user?.email
		? session.user.role === Enum.Role.ADMIN
		: false

	return (
		<main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
			{/* 히어로 섹션 */}
			<section className="relative max-w-5xl mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8">
				{/* 배경 장식 */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />

				<div className="text-center">
					{/* 메인 아이콘 */}
					<div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 sm:mb-8 shadow-2xl">
						<span
							className="text-3xl sm:text-4xl text-white"
							role="img"
							aria-label="공지사항"
						>
							📢
						</span>
					</div>

					{/* 제목 */}
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
						공지사항
					</h1>

					{/* 구분선 */}
					<div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4 sm:mb-6" />

					{/* 설명 */}
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
						키다리 선생님의 최신 소식과 중요한 안내사항을 확인하세요
					</p>
				</div>
			</section>

			{/* 컨텐츠 섹션 */}
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<NoticePageClient isAdmin={isAdmin} initialPage={page} />
			</section>

			{/* 장식적 배경 요소 */}
			<div className="fixed top-1/4 right-10 w-32 h-32 bg-linear-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl -z-10" />
			<div className="fixed bottom-1/4 left-10 w-40 h-40 bg-linear-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl -z-10" />
		</main>
	)
}
