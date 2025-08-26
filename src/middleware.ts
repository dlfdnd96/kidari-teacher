import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname === '/components' &&
		process.env.NODE_ENV !== 'development'
	) {
		return NextResponse.rewrite(new URL('/not-found', request.url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: '/components',
}
