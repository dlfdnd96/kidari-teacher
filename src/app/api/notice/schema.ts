import { z } from 'zod/v4-mini'

export const NoticeEntitySchema = z.strictObject({
	author: z.object({
		name: z.nullable(z.string()),
	}),
	id: z.string(),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	isPublished: z.boolean(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	deletedAt: z.nullable(z.iso.datetime()),
})

export const NoticeListEntitySchema = z.array(NoticeEntitySchema)
