import { TRPCError } from '@trpc/server'
import { type PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Enum } from '@/enums'
import { middleware, procedure, router } from '@/server/trpc'
import { ERROR_MESSAGES } from '@/constants/trpc'
import type { Session } from 'next-auth'
import { Context } from '@/server/context'

/**
 * 트랜잭션 미들웨어
 */
export const transactionMiddleware = middleware(({ ctx, next }) => {
	return ctx.prisma.$transaction((tx) => {
		return next({
			ctx: {
				...ctx,
				prisma: tx as PrismaClient,
			},
		})
	})
})

/**
 * 인증 미들웨어 (App Router 전용)
 */
const enforceUserIsAuthed = middleware(async ({ ctx, next }) => {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: ERROR_MESSAGES.UNAUTHORIZED,
		})
	}

	return next({
		ctx: {
			...ctx,
			session,
		},
	})
})

/**
 * 관리자 권한 확인 미들웨어
 */
const enforceUserIsAdmin = middleware(async ({ ctx, next }) => {
	const session = (ctx as Context & { session: Session }).session

	if (!session || session.user.role !== Enum.Role.ADMIN) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: ERROR_MESSAGES.FORBIDDEN,
		})
	}

	return next({ ctx })
})

export const createTRPCRouter = router

export const publicProcedure = procedure

export const protectedProcedure = procedure
	.use(enforceUserIsAuthed)
	.use(transactionMiddleware)

export const adminProcedure = procedure
	.use(enforceUserIsAuthed)
	.use(enforceUserIsAdmin)
	.use(transactionMiddleware)
