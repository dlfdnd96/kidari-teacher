import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'
import GoogleProvider from 'next-auth/providers/google'
import { z } from 'zod/v4'

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
	},
}

export default NextAuth(authOptions)
