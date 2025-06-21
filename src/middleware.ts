import { withAuth } from 'next-auth/middleware'

export default withAuth({
	callbacks: {
		authorized({ token }) {
			return !!token
		},
	},
	pages: {
		signIn: '/?auth_trigger=login_required',
		error: '/?auth_trigger=login_required',
	},
})

export const config = {
	matcher: ['/(volunteer-activities|my-applications|profile)'],
}
