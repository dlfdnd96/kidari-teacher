import { router } from '@/server/trpc'
import { activityRouter } from '@/server/routers/activity'

export const appRouter = router({
	activity: activityRouter,
})

export type AppRouter = typeof appRouter
