import type { Provider } from 'next-auth'

declare module 'next-auth' {
	interface NextAuthOptions {
		providers: Provider[]
	}
	interface Profile {
		email_verified?: boolean
	}
}
