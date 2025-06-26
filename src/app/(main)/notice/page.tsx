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
		<main className="min-h-screen pt-20">
			<section className="max-w-6xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<NoticePageClient isAdmin={isAdmin} initialPage={page} />
			</section>
		</main>
	)
}
