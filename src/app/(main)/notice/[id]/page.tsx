import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NoticeDetailPageClient from '@/components/features/notice/NoticeDetailPageClient'
import { NoticeDetailPageProps } from '@/types/notice'

export async function generateMetadata({
	params,
}: NoticeDetailPageProps): Promise<Metadata> {
	const resolvedParams = await params
	const id = resolvedParams.id

	return {
		title: `공지사항 | 키다리 선생님`,
		description: '공지사항 상세 내용을 확인하세요.',
		alternates: {
			canonical: `/notice/${id}`,
		},
		openGraph: {
			title: '공지사항 | 키다리 선생님',
			description: '공지사항 상세 내용을 확인하세요.',
			type: 'article',
		},
	}
}

export default async function NoticeDetailPage({
	params,
}: NoticeDetailPageProps) {
	const { id } = await params

	if (!id) {
		notFound()
	}

	return (
		<main className="min-h-screen pt-20">
			<section className="max-w-4xl mx-auto pb-12 sm:pb-20 px-4 sm:px-8">
				<NoticeDetailPageClient noticeId={id} />
			</section>
		</main>
	)
}
