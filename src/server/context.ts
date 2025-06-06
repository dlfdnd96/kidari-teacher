import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '@/lib/prisma'

export const createTRPCContext = (opts: CreateNextContextOptions) => {
	return {
		...opts,
		prisma,
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
