import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		if (body.NODE_ENV !== 'test' || body.CYPRESS !== 'true') {
			return NextResponse.json({ message: 'Not found' }, { status: 404 })
		}

		const { role } = body
		const [user, email, parsedRole] = z
			.tuple([z.string(), z.string(), ZodEnum.Role])
			.parse([body.TEST_USER, body.TEST_EMAIL, role])

		const testUser = await prisma.user.upsert({
			where: { email },
			update: { role },
			create: {
				email,
				name: user,
				role: parsedRole,
			},
		})

		const sessionToken = crypto.randomUUID()
		const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

		await prisma.session.create({
			data: {
				sessionToken,
				userId: testUser.id,
				expires,
			},
		})

		const response = NextResponse.json({
			success: true,
			user: testUser,
			sessionToken,
		})

		response.cookies.set('next-auth.session-token', sessionToken, {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			expires: expires,
		})

		return response
	} catch (error) {
		console.error('Test login error:', error)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 },
		)
	}
}
