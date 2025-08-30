import { router } from '@/server/trpc'
import { historyRouter } from '@/server/routers/history'
import { activityRouter } from '@/server/routers/activity'

export const appRouter = router({
	history: historyRouter,
	activity: activityRouter,
})

export type AppRouter = typeof appRouter
