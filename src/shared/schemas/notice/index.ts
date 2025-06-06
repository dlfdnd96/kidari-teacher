import { z } from 'zod/v4-mini'
import { PageableSchema } from '@/shared/schemas'

export const NoticeEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	isPublished: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	author: z.object({
		name: z.nullable(z.string()),
	}),
})

export const NoticeListEntitySchema = z.array(NoticeEntitySchema)

export const NoticeFilterInputSchema = z.object({
	filter: z.optional(
		z.object({
			isPublished: z.boolean(),
		}),
	),
	pageable: z.optional(PageableSchema),
})

export const CreateNoticeInputSchema = z.object({
	title: z.string().check(z.minLength(1)),
	content: z.string().check(z.minLength(1)),
	adminId: z.string().check(z.cuid()),
})

export const UpdateNoticeInputSchema = z.object({
	id: z.string().check(z.cuid()),
	title: z.string().check(z.minLength(1)),
	content: z.string().check(z.minLength(1)),
})

export const DeleteNoticeInputSchema = z.object({
	id: z.string().check(z.cuid()),
})

export const NoticeFormSchema = z.object({
	title: z.string().check(z.minLength(1, '제목을 입력해주세요.')),
	content: z.string().check(z.minLength(1, '내용을 입력해주세요.')),
})

export const NoticeEditFormSchema = z.object({
	title: z.string().check(z.minLength(1, '제목을 입력해주세요.')),
	content: z.string().check(z.minLength(1, '내용을 입력해주세요.')),
})
