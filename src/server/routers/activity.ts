import * as z from 'zod/mini'
import { list } from '@vercel/blob'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter } from '@/server/api/trpc'
import { procedure } from '@/server/trpc'
import { ActivityRecordSchema } from '@/schemas/landing'
import { ERROR_MESSAGE } from '@/constants/error'

export const activityRouter = createTRPCRouter({
	fetch: procedure.query(async () => {
		try {
			const token = z.string().parse(process.env.BLOB_READ_WRITE_TOKEN)
			const { blobs } = await list({
				prefix: 'landing/activity-records.json',
				token,
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
