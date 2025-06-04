import React from 'react'
import { prisma } from '@/lib/prisma'
import NoticeList from '@/components/features/notice/NoticeList'
import { Metadata } from 'next'
import NoticeForm from '@/components/features/notice/NoticeForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Enum } from '@/enums'

export const metadata: Metadata = {
	title: '공지사항 | 키다리 선생님',
	description: '키다리 선생님의 최신 공지사항을 확인하세요.',
}

export default async function NoticePage() {
	const session = await getServerSession(authOptions)
	let isAdmin = false
	if (session?.user.email) {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})
		isAdmin = user?.role === Enum.Role.ADMIN
	}

	const notices = await prisma.notice.findMany({
		where: { isPublished: true, deletedAt: null },
		orderBy: { createdAt: 'desc' },
		include: { author: { select: { name: true } } },
	})

	const safeNotices = notices.map((notice) => ({
		...notice,
		createdAt: notice.createdAt.toISOString(),
	}))

	return (
		<main className="max-w-2xl mx-auto py-10 px-4">
			<h1 className="text-2xl font-bold mb-6 text-center">공지사항</h1>
			{isAdmin && <NoticeForm />}
			<NoticeList notices={safeNotices} />
		</main>
	)
}
