import type { Provider } from 'next-auth'
import type { Role } from '@/generated/prisma'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: Role
			email: string | undefined | null
			name: string | undefined | null
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

declare module 'next-auth/jwt' {
	interface JWT {
		userId: string
		role: Role
		email: string | undefined | null
		name: string | undefined | null
	}
}
