import type { Provider } from 'next-auth'
import type { Role } from '@/generated/prisma'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: Role
			name: string | undefined | null
			email: string | undefined | null
			phone: string | undefined | null
		}
	}

	interface User {
		id: string
		role: Role
		isNewUser: boolean
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
		isNewUser: boolean
		name: string | undefined | null
		email: string | undefined | null
		phone: string | undefined | null
	}
}
