import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession(authOptions)
	const email = session?.user?.email
	if (!email) {
		return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || user.role !== 'ADMIN') {
		return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
	}

	const { title, content } = await req.json()
	if (!title || !content) {
		return NextResponse.json(
			{ error: '제목과 내용을 입력하세요.' },
			{ status: 400 },
		)
	}

	const { id } = await params
	try {
		const notice = await prisma.notice.update({
			where: { id },
			data: {
				title,
				content,
			},
			include: { author: { select: { name: true } } },
		})
		return NextResponse.json({ notice })
	} catch (_error) {
		return NextResponse.json({ error: '공지사항 수정 실패' }, { status: 500 })
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession(authOptions)
	const email = session?.user?.email
	if (!email) {
		return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || user.role !== 'ADMIN') {
		return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
	}

	try {
		const { id } = await params
		await prisma.notice.update({
			where: { id },
			data: { deletedAt: new Date() },
		})
		return NextResponse.json({ success: true })
	} catch (_error) {
		return NextResponse.json({ error: '공지사항 삭제 실패' }, { status: 500 })
	}
}
