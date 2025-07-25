import { z } from 'zod/mini'
import { PageableSchema } from '@/shared/schemas'
import { UserEntitySchema } from '@/shared/schemas/user'

export const NoticeEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	get author(): z.ZodMiniOptional<typeof UserEntitySchema> {
		return z.optional(UserEntitySchema)
	},
	isPublished: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
})

export const NoticePickAuthorEntitySchema = z.strictObject({
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
	title: z
		.string()
		.check(
			z.minLength(1, '제목을 입력해주세요.'),
			z.maxLength(255, '제목은 255자 이내로 입력해주세요.'),
		),
	content: z.string().check(z.minLength(1, '내용을 입력해주세요.')),
})

export const UpdateNoticeInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 ID가 아닙니다')),
	...CreateNoticeInputSchema.def.shape,
})

export const DeleteNoticeInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 ID가 아닙니다')),
})

export const getNoticeInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 ID가 아닙니다')),
})

export const NoticeFormSchema = CreateNoticeInputSchema
