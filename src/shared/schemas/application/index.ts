import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'
import { UserEntitySchema } from '@/shared/schemas/user'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { SelectionEntitySchema } from '@/shared/schemas/selection'
import { ZodType } from '@/shared/types'
import { PageableSchema } from '@/shared/schemas'

interface ApplicationAttributes {
	id: string
	userId: string
	volunteerActivityId: string
	emergencyContact: string
	status: ZodType<typeof ZodEnum.ApplicationStatus>
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	user?: ZodType<typeof UserEntitySchema>
	volunteerActivity?: ZodType<typeof VolunteerActivityEntitySchema>
	selection?: ZodType<typeof SelectionEntitySchema> | null
}

export const ApplicationEntitySchema: z.ZodMiniType<ApplicationAttributes> =
	z.strictObject({
		id: z.string().check(z.cuid()),
		userId: z.string().check(z.cuid()),
		user: z.optional(z.lazy(() => UserEntitySchema)),
		volunteerActivityId: z.string().check(z.cuid()),
		volunteerActivity: z.optional(z.lazy(() => VolunteerActivityEntitySchema)),
		emergencyContact: z.string().check(z.minLength(1), z.maxLength(100)),
		status: ZodEnum.ApplicationStatus,
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.nullable(z.date()),
		selection: z.nullable(z.optional(z.lazy(() => SelectionEntitySchema))),
	})

export const CreateApplicationInputSchema = z.strictObject({
	volunteerActivityId: z
		.string()
		.check(z.cuid('올바른 봉사활동 ID가 아닙니다')),
	emergencyContact: z
		.string()
		.check(
			z.minLength(1, '긴급연락처를 입력해주세요'),
			z.maxLength(100, '긴급연락처는 100자 이내로 입력해주세요'),
			z.regex(/^[0-9-+().\s]+$/, '올바른 전화번호 형식이 아닙니다'),
		),
})

export const UpdateApplicationStatusInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 신청 ID가 아닙니다')),
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
			z.minLength(1, '긴급연락처를 입력해주세요'),
			z.maxLength(100, '긴급연락처는 100자 이내로 입력해주세요'),
			z.regex(
				/^[0-9-+().\s]+$/,
				'올바른 전화번호 형식이 아닙니다 (숫자, -, +, (), ., 공백만 가능)',
			),
		),
})
