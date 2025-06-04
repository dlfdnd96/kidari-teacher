import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Enum } from '@/enums'

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	const email = session?.user.email
	if (!email) {
		return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || user.role !== Enum.Role.ADMIN) {
		return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
	}

	const { title, content } = await req.json()
	if (!title || !content) {
		return NextResponse.json(
			{ error: '제목과 내용을 입력하세요.' },
			{ status: 400 },
		)
	}

	try {
		const notice = await prisma.notice.create({
			data: {
				title,
				content,
				authorId: user.id,
				isPublished: true,
			},
			include: { author: { select: { name: true } } },
		})
		return NextResponse.json({ notice })
	} catch (error) {
		return NextResponse.json({ error: '공지사항 등록 실패' }, { status: 500 })
	}
}
