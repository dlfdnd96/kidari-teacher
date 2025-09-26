import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import * as z from 'zod/mini'
import { TRPCError } from '@trpc/server'
import { VolunteerActivityStatisticsListSchema } from '@/schemas/statistics'
import { ERROR_MESSAGE } from '@/constants/error'
import { createSupabaseClient } from '@/server/api/supabase'

export const statisticsRouter = createTRPCRouter({
	fetch: procedure.query(async () => {
		const bucketName = z.string().parse(process.env.SUPABASE_BUCKET_NAME)

		const supabase = await createSupabaseClient()

		const { data, error } = await supabase.storage
			.from(bucketName)
			.download('statistics/volunteer-statistics.json')

		if (error) {
			throw new TRPCError({
				code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
				message: `Failed to fetch activity data: ${error.message}`,
			})
		}

		const text = await data.text()
		return VolunteerActivityStatisticsListSchema.parse(JSON.parse(text))
	}),
})
