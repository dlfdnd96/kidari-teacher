import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/context'

const handler = async (req: Request) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ req }),
		onError:
			process.env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? '<no-path>'}:`, error)
					}
				: undefined,
	})

export { handler as GET, handler as POST }
