import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NoticeEditPageClient from '@/components/features/notice/NoticeEditPageClient'
import { NoticeEditPageProps } from '@/types/notice'

export const metadata: Metadata = {
	title: '공지사항 수정 | 키다리 선생님',
	description: '공지사항을 수정합니다.',
}

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
	const { id } = await params

	if (!id) {
		notFound()
	}

	return (
		<main className="min-h-screen">
			<NoticeEditPageClient id={id} />
		</main>
	)
}
