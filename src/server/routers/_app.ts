import { router } from '@/server/trpc'
import { noticeRouter } from '@/server/routers/notice'
import { volunteerActivityRouter } from '@/server/routers/volunteer-activity'
import { applicationRouter } from '@/server/routers/application'

export const appRouter = router({
	notice: noticeRouter,
	volunteerActivity: volunteerActivityRouter,
	application: applicationRouter,
})

export type AppRouter = typeof appRouter
