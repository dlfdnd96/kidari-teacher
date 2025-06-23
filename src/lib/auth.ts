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
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google' && !profile?.email_verified) {
				return false
			}

			try {
				const userProfile = await prisma.userProfile.findUnique({
					where: {
						userId: user.id,
						deletedAt: null,
					},
				})

				user.isNewUser = !userProfile

				return true
			} catch (error) {
				console.error('Error in signIn callback:', error)
				return false
			}
		},

		async jwt({ token, user, account }) {
			if (user) {
				token.userId = user.id
				token.role = user.role
				token.isNewUser = user.isNewUser
			}

			try {
				if (account) {
					const userProfile = await prisma.userProfile.findUnique({
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
									name: true,
									email: true,
								},
							},
						},
					})

					if (userProfile) {
						token.name = userProfile.user.name
						token.email = userProfile.user.email
						token.phone = userProfile.phone
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
				session.user.name = token.name
				session.user.email = token.email
				session.user.phone = token.phone
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
