import { z } from 'zod/v4-mini'
import { PageableSchema } from '@/shared/schemas'
import { UserEntitySchema } from '@/shared/schemas/user'
import { ZodType } from '@/shared/types'

interface NoticeAttributes {
	id: string
	title: string
	content: string
	authorId: string
	isPublished: boolean
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	author?: ZodType<typeof UserEntitySchema>
}

export const NoticeEntitySchema: z.ZodMiniType<NoticeAttributes> =
	z.strictObject({
		id: z.string().check(z.cuid()),
		title: z.string(),
		content: z.string(),
		authorId: z.string(),
		author: z.optional(z.lazy(() => UserEntitySchema)),
		isPublished: z.boolean(),
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.nullable(z.date()),
	})

export const NoticePickAuthorEntitySchema: z.ZodMiniType<
	Omit<NoticeAttributes, 'author'> & { author: { name: string | null } }
> = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	author: z.strictObject({
		name: z.nullable(z.string()),
	}),
	isPublished: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
})

export const NoticeListEntitySchema = z.array(NoticePickAuthorEntitySchema)

export const NoticeListResponseSchema = z.strictObject({
	noticeList: NoticeListEntitySchema,
	totalCount: z.number().check(z.nonnegative()),
})

export const NoticeListFilterInputSchema = z.optional(
	z.strictObject({
		filter: z.optional(
			z.strictObject({
				isPublished: z.boolean(),
			}),
		),
		pageable: z.optional(PageableSchema),
	}),
)

export const CreateNoticeInputSchema = z.strictObject({
	title: z.string().check(z.minLength(1)),
	content: z.string().check(z.minLength(1)),
})

export const UpdateNoticeInputSchema = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string().check(z.minLength(1)),
	content: z.string().check(z.minLength(1)),
})

export const DeleteNoticeInputSchema = z.strictObject({
	id: z.string().check(z.cuid()),
})

export const NoticeFormSchema = z.strictObject({
	title: z.string().check(z.minLength(1, '제목을 입력해주세요.')),
	content: z.string().check(z.minLength(1, '내용을 입력해주세요.')),
})

export const NoticeEditFormSchema = z.strictObject({
	title: z.string().check(z.minLength(1, '제목을 입력해주세요.')),
	content: z.string().check(z.minLength(1, '내용을 입력해주세요.')),
})
