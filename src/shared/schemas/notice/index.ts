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

const NoticePickAuthorEntitySchema: z.ZodMiniType<
	Omit<NoticeAttributes, 'author'> & { author: { name: string | null } }
> = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	author: z.object({
		name: z.nullable(z.string()),
	}),
	isPublished: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
})

export const NoticeListEntitySchema = z.array(NoticePickAuthorEntitySchema)

export const NoticeListResponseSchema = z.object({
	noticeList: NoticeListEntitySchema,
	totalCount: z.number().check(z.nonnegative()),
})

export const NoticeListFilterInputSchema = z.optional(
	z.object({
		filter: z.optional(
			z.object({
				isPublished: z.boolean(),
			}),
		),
		pageable: z.optional(PageableSchema),
	}),
)

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
