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
			authorization: {
				params: {
					prompt: 'select_account',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === 'google' && !profile?.email_verified) {
				return false
			}
			return true
		},

		async jwt({ token, user, account, trigger, session }) {
			if (user) {
				token.userId = user.id
				token.role = user.role
				token.name = user.name
			}

			if (trigger === 'update' && session?.user) {
				token.name = session.user.name
				token.email = session.user.email
			}

			try {
				if (account) {
					const userProfile = await prisma.userProfile.findFirst({
						where: {
							userId: token.userId,
							deletedAt: null,
							user: {
								deletedAt: null,
							},
						},
						include: {
							user: {
								select: {
									email: true,
									name: true,
								},
							},
						},
					})

					if (userProfile) {
						token.email = userProfile.user.email
						token.name = userProfile.user.name
					}
				}
			} catch (error) {
				console.error('Error in jwt callback:', error)
			}

			return token
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.userId
				session.user.role = token.role
				session.user.email = token.email
				session.user.name = token.name
			}
			return session
		},
	},
	jwt: {
		maxAge: 14 * 24 * 60 * 60, // 14 days
	},
	session: {
		strategy: 'jwt',
		maxAge: 14 * 24 * 60 * 60, // 14 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	pages: {
		signIn: '/profile/check',
	},
}
