import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/context'
import { logError } from '@/utils/error'

const handler = async (req: Request) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ req }),
		onError: ({ path, error }) => {
			logError(error, `tRPC API ${path ?? '<no-path>'}`)
		},
	})

export { handler as GET, handler as POST }
