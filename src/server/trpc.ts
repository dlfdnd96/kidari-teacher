import { initTRPC } from '@trpc/server'
import { Context } from '@/server/context'
import { ZodError } from 'zod/v4'
import { z } from 'zod/v4-mini'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) {
		const { shape, error } = opts
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? z.treeifyError(error.cause)
						: null,
			},
		}
	},
	transformer: superjson,
})

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware
