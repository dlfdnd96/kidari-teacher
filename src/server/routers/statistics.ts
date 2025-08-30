import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import * as z from 'zod/mini'
import { TRPCError } from '@trpc/server'
import { VolunteerActivityStatisticsListSchema } from '@/schemas/statistics'
import { ERROR_MESSAGE } from '@/constants/error'

export const statisticsRouter = createTRPCRouter({
	fetch: procedure.query(async () => {
		const appScriptUrl = z.string().parse(process.env.APP_SCRIPT_URL)

		const response = await fetch(appScriptUrl, {
			method: 'GET',
			headers: {
				'Cache-Control': 'no-cache',
			},
		})

		if (!response.ok) {
			throw new TRPCError({
				code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
				message: `Failed to fetch data from statistics: ${response.status} ${response.statusText}`,
			})
		}

		const rawData = await response.json()
		return VolunteerActivityStatisticsListSchema.parse(rawData)
	}),
})
