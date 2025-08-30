import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import * as z from 'zod/mini'
import { TRPCError } from '@trpc/server'
import { ActivityRecordSchema } from '@/shared/schemas/landing'
import { createSupabaseClient } from '@/server/api/supabase'
import { ERROR_MESSAGE } from '@/constants/error'

export const activityRouter = createTRPCRouter({
	fetch: procedure.query(async () => {
		const bucketName = z.string().parse(process.env.SUPABASE_BUCKET_NAME)

		const supabase = await createSupabaseClient()

		const { data, error } = await supabase.storage
			.from(bucketName)
			.download('landing/activity-records.json')

		if (error) {
			throw new TRPCError({
				code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
				message: `Failed to fetch activity data: ${error.message}`,
			})
		}

		const text = await data.text()
		return ActivityRecordSchema.parse(JSON.parse(text))
	}),
})
