import { router } from '@/server/trpc'
import { noticeRouter } from '@/server/routers/notice'
import { volunteerActivityRouter } from '@/server/routers/volunteer-activity'
import { applicationRouter } from '@/server/routers/application'
import { userRouter } from '@/server/routers/user'

export const appRouter = router({
	notice: noticeRouter,
	volunteerActivity: volunteerActivityRouter,
	application: applicationRouter,
	user: userRouter,
})

export type AppRouter = typeof appRouter
