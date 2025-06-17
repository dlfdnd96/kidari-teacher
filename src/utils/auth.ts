import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireAuth(redirectTo: string = '/') {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		redirect(`${redirectTo}?auth_trigger=login_required`)
	}

	return session
}

export async function requireAdmin(redirectTo: string = '/') {
	const session = await requireAuth(redirectTo)

	if (session.user.role !== 'ADMIN') {
		redirect(`${redirectTo}?auth_trigger=admin_required`)
	}

	return session
}

export async function requireRole(
	requiredRole: string,
	redirectTo: string = '/',
) {
	const session = await requireAuth(redirectTo)

	if (session.user.role !== requiredRole) {
		redirect(`${redirectTo}?auth_trigger=role_required&role=${requiredRole}`)
	}

	return session
}
