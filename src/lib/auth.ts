import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import NaverProvider from 'next-auth/providers/naver'
import { z } from 'zod/v4-mini'
import KakaoProvider from 'next-auth/providers/kakao'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		NaverProvider({
			clientId: z.string().parse(process.env.NAVER_CLIENT_ID),
			clientSecret: z.string().parse(process.env.NAVER_CLIENT_SECRET),
		}),
		KakaoProvider({
			clientId: z.string().parse(process.env.KAKAO_CLIENT_ID),
			clientSecret: z.string().parse(process.env.KAKAO_CLIENT_SECRET),
		}),
		GoogleProvider({
			clientId: z.string().parse(process.env.GOOGLE_CLIENT_ID),
			clientSecret: z.string().parse(process.env.GOOGLE_CLIENT_SECRET),
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === 'google') {
				return !!profile?.email_verified
			}
			return true
		},

		async jwt({ token, user }) {
			if (user) {
				token.userId = user.id
				token.role = user.role
			}
			return token
		},

		async session({ session, token }) {
			if (token.userId) {
				session.user.id = token.userId
				session.user.role = token.role
			}
			return session
		},
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
}
