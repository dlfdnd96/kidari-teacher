import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname === '/statistics' &&
		process.env.NODE_ENV === 'production'
	) {
		return NextResponse.rewrite(new URL('/not-found', request.url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: '/components',
}
