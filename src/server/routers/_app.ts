import { router } from '@/server/trpc'
import { noticeRouter } from '@/server/routers/notice'
import { volunteerActivityRouter } from '@/server/routers/volunteer-activity'

export const appRouter = router({
	notice: noticeRouter,
	volunteerActivity: volunteerActivityRouter,
})

export type AppRouter = typeof appRouter
