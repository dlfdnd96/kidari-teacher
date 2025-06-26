import React from 'react'
import { Metadata } from 'next'
import NoticeCreatePageClient from '@/components/features/notice/NoticeCreatePageClient'

export const metadata: Metadata = {
	title: '공지사항 작성 | 키다리 선생님',
	description: '새로운 공지사항을 작성합니다.',
}

export default async function NoticeCreatePage() {
	return (
		<main className="min-h-screen pt-20">
			<NoticeCreatePageClient />
		</main>
	)
}
