import { z } from 'zod/v4'

export const NoticeEntitySchema = z
	.object({
		author: z.object({
			name: z.string().nullable(),
		}),
		id: z.string(),
		title: z.string(),
		content: z.string(),
		authorId: z.string(),
		isPublished: z.boolean(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
		deletedAt: z.iso.datetime().nullable(),
	})
	.strict()

export const NoticeListEntitySchema = z.array(NoticeEntitySchema)
