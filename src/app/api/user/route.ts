import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod/v4'

export async function GET(req: NextRequest) {
	const email = z
		.email('Missing email')
		.parse(req.nextUrl.searchParams.get('email'))
	const user = await prisma.user.findUnique({
		where: { email },
	})
	return NextResponse.json(user)
}
