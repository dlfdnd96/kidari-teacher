import type { Provider } from 'next-auth'
import type { Role } from '@/generated/prisma'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			name?: string | null
			email?: string | null
			image?: string | null
			role: Role
		}
	}
	interface User {
		id: string
		role: Role
	}
	interface NextAuthOptions {
		providers: Provider[]
	}
	interface Profile {
		email_verified?: boolean
	}
}
