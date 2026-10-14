import { list } from '@vercel/blob'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import { ActivityRecordSchema } from '@/schemas/landing'
import { ERROR_MESSAGE } from '@/constants/error'

export const activityRouter = createTRPCRouter({
	fetch: procedure.query(async () => {
		try {
			// token 옵션을 넘기면 OIDC(VERCEL_OIDC_TOKEN + BLOB_STORE_ID)보다 우선하므로 넘기지 않는다
			const { blobs } = await list({
				prefix: 'landing/activity-records.json',
			})

			if (blobs.length === 0) {
				throw new TRPCError({
					code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
					message: 'Activity records file not found',
				})
			}

			const blob = blobs[0]
			const response = await fetch(blob.url)

			if (!response.ok) {
				throw new TRPCError({
					code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
					message: `Failed to fetch activity data: ${response.statusText}`,
				})
			}

			const text = await response.text()
			return ActivityRecordSchema.parse(JSON.parse(text))
		} catch (error) {
			if (error instanceof TRPCError) {
				throw error
			}

			throw new TRPCError({
				code: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
				message: `Failed to fetch activity data: ${error instanceof Error ? error.message : 'Unknown error'}`,
			})
		}
	}),
})
