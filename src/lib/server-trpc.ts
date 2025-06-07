import { cache } from 'react'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/context'

export const createCaller = cache(() => {
	const mockRequest = new Request(`${process.env.NEXTAUTH_URL}/api/trpc`)

	const context = createTRPCContext({ req: mockRequest })
	return appRouter.createCaller(context)
})

export const getServerTrpc = cache(() => {
	const context = createTRPCContext({
		req: {} as any,
		res: {} as any,
	})
	return appRouter.createCaller(context)
})
