import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import * as z from 'zod/mini'
import { TRPCError } from '@trpc/server'
import { VolunteerActivityHistoryListSchema } from '@/shared/schemas/landing'

export const historyRouter = createTRPCRouter({
	fetchData: procedure.query(async () => {
		const appScriptUrl = z.string().parse(process.env.APP_SCRIPT_URL)

		try {
			const response = await fetch(appScriptUrl, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
				},
			})

			if (!response.ok) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `Failed to fetch data from history: ${response.status} ${response.statusText}`,
				})
			}

			const rawData = await response.json()
			return VolunteerActivityHistoryListSchema.parse(rawData)
		} catch (error) {
			if (error instanceof TRPCError) {
				throw error
			}

			console.error('Error fetching history data:', error)
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to fetch history data',
			})
		}
	}),
})
