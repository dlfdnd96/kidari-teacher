import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { Enum } from '@/enums'

export async function requireAdminSession() {
	const session = await getServerSession(authOptions)
	const email = session?.user?.email
	if (!email) {
		return { error: { error: '로그인이 필요합니다.', status: 401 } }
	}

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || user.role !== Enum.Role.ADMIN) {
		return { error: { error: '권한이 없습니다.', status: 403 } }
	}

	return { session, user }
}
