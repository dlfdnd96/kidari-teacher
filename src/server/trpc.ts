import { initTRPC } from '@trpc/server'
import { Context } from '@/server/context'
import { ZodError } from 'zod'
import * as z from 'zod/mini'
import superjson from 'superjson'
import { getErrorMessage, logError } from '@/utils/error'

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) {
		const { shape, error, path } = opts

		logError(error, `tRPC ${path || 'unknown'}`)

		const safeMessage = getErrorMessage(error)

		return {
			...shape,
			message: safeMessage,
			data: {
				...shape.data,
				zodError:
					process.env.NODE_ENV === 'development' &&
					error.code === 'BAD_REQUEST' &&
					error.cause instanceof ZodError
						? z.treeifyError(error.cause)
						: null,
			},
		}
	},
	transformer: superjson,
})

export const router = t.router
export const procedure = t.procedure
