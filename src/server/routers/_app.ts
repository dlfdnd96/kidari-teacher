import { router } from '@/server/trpc'
import { activityRouter } from '@/server/routers/activity'
import { statisticsRouter } from '@/server/routers/statistics'

export const appRouter = router({
	activity: activityRouter,
	statistics: statisticsRouter,
})

export type AppRouter = typeof appRouter
