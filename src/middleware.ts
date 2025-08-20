import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_PAGE_URL_PATTERN, ERROR_REDIRECT_URI } from '@/constants/auth'

export function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname === '/components' &&
		process.env.NODE_ENV !== 'development'
	) {
		return NextResponse.rewrite(new URL('/not-found', request.url))
	}
	return NextResponse.next()
}

export default withAuth(
	async function middleware(req) {
		const { token } = req.nextauth
		const pathname = req.nextUrl.pathname

		if (!token && AUTH_PAGE_URL_PATTERN.test(pathname)) {
			return NextResponse.redirect(new URL('/', req.url))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized({ token }) {
				return !!token
			},
		},
		pages: {
			signIn: ERROR_REDIRECT_URI,
			error: ERROR_REDIRECT_URI,
		},
	},
)

export const config = {
	matcher: '/components',
}
