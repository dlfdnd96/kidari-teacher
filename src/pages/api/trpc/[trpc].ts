import * as trpcNext from '@trpc/server/adapters/next'
import { createTRPCContext } from '@/server/context'
import { appRouter } from '@/server/routers/_app'

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: createTRPCContext,
	onError:
		process.env.NODE_ENV === 'development'
			? ({ path, error }) => {
					console.error(`❌ tRPC failed on ${path ?? '<no-path>'}:`, error)
				}
			: undefined,
})
