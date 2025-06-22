import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { AUTH_PAGE_URL_PATTERN, ERROR_REDIRECT_URI } from '@/constants/auth'

export default withAuth(
	async function middleware(req) {
		const { token } = req.nextauth
		const pathname = req.nextUrl.pathname

		if (!token && AUTH_PAGE_URL_PATTERN.test(pathname)) {
			return NextResponse.redirect(new URL('/', req.url))
		}

		if (token && !AUTH_PAGE_URL_PATTERN.test(pathname)) {
			return NextResponse.next()
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
	matcher: ['/(volunteer-activities|my-applications|profile)'],
}
