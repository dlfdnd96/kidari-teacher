import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { error } = await requireAdminSession()
	if (error) {
		return NextResponse.json({ error: error.error }, { status: error.status })
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
	const { error } = await requireAdminSession()
	if (error) {
		return NextResponse.json({ error: error.error }, { status: error.status })
	}

	const { id } = await params
	try {
		await prisma.notice.update({
			where: { id },
			data: { deletedAt: new Date() },
		})
		return NextResponse.json({ success: true })
	} catch (_error) {
		return NextResponse.json({ error: '공지사항 삭제 실패' }, { status: 500 })
	}
}
