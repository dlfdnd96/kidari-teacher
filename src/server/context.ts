import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { CreateContextOptions } from '@/shared/types'

function isPagesRouterContext(
	opts: CreateContextOptions,
): opts is CreateNextContextOptions {
	return 'res' in opts && 'query' in (opts as any).req
}

export function createTRPCContext(opts: CreateContextOptions) {
	if (isPagesRouterContext(opts)) {
		return {
			...opts,
		}
	} else {
		return {
			req: opts.req,
		}
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
