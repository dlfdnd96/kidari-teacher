import * as z from 'zod/mini'
import { ZodEnum } from '@/enums'
import { UserEntitySchema } from '@/shared/schemas/user'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { SelectionEntitySchema } from '@/shared/schemas/selection'
import { PageableSchema } from '@/shared/schemas'

export const ApplicationEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	userId: z.string().check(z.cuid()),
	get user(): z.ZodMiniOptional<typeof UserEntitySchema> {
		return z.optional(UserEntitySchema)
	},
	volunteerActivityId: z.string().check(z.cuid()),
	get volunteerActivity(): z.ZodMiniOptional<
		typeof VolunteerActivityEntitySchema
	> {
		return z.optional(VolunteerActivityEntitySchema)
	},
	emergencyContact: z.string().check(z.minLength(1), z.maxLength(100)),
	profession: ZodEnum.Profession,
	status: ZodEnum.ApplicationStatus,
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	get selection(): z.ZodMiniOptional<
		z.ZodMiniNullable<typeof SelectionEntitySchema>
	> {
		return z.optional(z.nullable(SelectionEntitySchema))
	},
})

export const CreateApplicationInputSchema = z.strictObject({
	volunteerActivityId: z
		.string()
		.check(z.cuid('올바른 봉사활동 ID가 아닙니다')),
	emergencyContact: z
		.string()
		.check(
			z.minLength(9, '긴급연락처는 최소 9자리 이상이어야 합니다'),
			z.maxLength(11, '긴급연락처는 최대 11자리까지 가능합니다'),
			z.regex(/^[0-9]+$/, '숫자만 입력 가능합니다'),
		),
	profession: ZodEnum.Profession,
})

export const UpdateApplicationStatusInputSchema = z.strictObject({
	ids: z.array(z.string().check(z.cuid('올바른 신청 ID가 아닙니다'))),
	status: ZodEnum.ApplicationStatus,
})

export const DeleteApplicationInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 신청 ID가 아닙니다')),
})

export const ApplicationFilterInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 신청 ID가 아닙니다')),
})

export const ApplicationListFilterInputSchema = z.optional(
	z.strictObject({
		filter: z.optional(
			z.strictObject({
				status: z.optional(z.string()),
				volunteerActivityId: z.optional(z.string()),
				userId: z.optional(z.string()),
				search: z.optional(z.string()),
			}),
		),
		pageable: z.optional(PageableSchema),
	}),
)

export const MyApplicationListFilterInputSchema = z.optional(
	z.strictObject({
		filter: z.optional(
			z.strictObject({
				userId: z.optional(z.string()),
				status: z.optional(z.string()),
			}),
		),
		pageable: z.optional(PageableSchema),
	}),
)

export const ApplicationListResponseSchema = z.strictObject({
	applicationList: z.array(ApplicationEntitySchema),
	totalCount: z.number(),
})

export const MyApplicationListResponseSchema = z.strictObject({
	myApplicationList: z.array(ApplicationEntitySchema),
	totalCount: z.number(),
})

export const ApplicationFormSchema = z.strictObject({
	emergencyContact: z
		.string()
		.check(
			z.minLength(9, '긴급연락처는 최소 9자리 이상이어야 합니다'),
			z.maxLength(11, '긴급연락처는 최대 11자리까지 가능합니다'),
			z.regex(/^[0-9]+$/, '숫자만 입력 가능합니다'),
		),
	profession: ZodEnum.Profession,
})
