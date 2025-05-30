import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/api/auth/error') {
		const error = request.nextUrl.searchParams.get('error')
		const origin = request.nextUrl.origin
		return NextResponse.redirect(
			`${origin}/auth/error${error ? `?error=${error}` : ''}`,
		)
	}
	return NextResponse.next()
}
export const config = {
	matcher: ['/api/auth/error'],
}
