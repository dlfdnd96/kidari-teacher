import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '@/lib/prisma'

interface CreateAppContextOptions {
	req: Request
}

type CreateContextOptions = CreateNextContextOptions | CreateAppContextOptions

function isPagesRouterContext(
	opts: CreateContextOptions,
): opts is CreateNextContextOptions {
	return 'res' in opts && 'query' in (opts as any).req
}

export function createTRPCContext(opts: CreateContextOptions) {
	if (isPagesRouterContext(opts)) {
		return {
			...opts,
			prisma,
		}
	} else {
		return {
			req: opts.req,
			prisma,
		}
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
