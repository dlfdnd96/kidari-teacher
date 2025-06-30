import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'
import { encode } from 'next-auth/jwt'

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

		// JWT 토큰 생성
		const secret = process.env.NEXTAUTH_SECRET
		if (!secret) {
			throw new Error('NEXTAUTH_SECRET is not defined')
		}

		const maxAge = 30 * 24 * 60 * 60 // 30 days
		const expires = new Date(Date.now() + maxAge * 1000)

		// JWT 페이로드 생성
		const token = {
			sub: testUser.id,
			userId: testUser.id,
			name: testUser.name,
			email: testUser.email,
			role: testUser.role,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + maxAge,
		}

		// NextAuth의 encode 함수를 사용하여 JWT 토큰 생성
		const jwtToken = await encode({
			token,
			secret,
			maxAge,
		})

		const response = NextResponse.json({
			success: true,
			user: testUser,
			token: jwtToken,
		})

		// JWT 토큰을 next-auth.session-token 쿠키에 설정
		response.cookies.set('next-auth.session-token', jwtToken, {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			expires: expires,
			secure: process.env.NODE_ENV === 'production',
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
