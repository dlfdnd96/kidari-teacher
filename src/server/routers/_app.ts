import { router } from '@/server/trpc'
import { noticeRouter } from '@/server/routers/notice'

export const appRouter = router({
	notice: noticeRouter,
})

export type AppRouter = typeof appRouter
