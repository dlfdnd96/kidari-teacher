import { router } from '@/server/trpc'
import { historyRouter } from '@/server/routers/history'

export const appRouter = router({
	history: historyRouter,
})

export type AppRouter = typeof appRouter
