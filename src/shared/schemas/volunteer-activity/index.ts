import { z } from 'zod/v4-mini'
import { TZDate } from '@date-fns/tz'
import { PageableSchema } from '@/shared/schemas'
import { ZodEnum } from '@/enums'
import { UserEntitySchema } from '@/shared/schemas/user'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { ZodType } from '@/shared/types'

interface VolunteerActivityAttributes {
	id: string
	title: string
	description: string
	startAt: Date
	endAt: Date
	location: string
	status: ZodType<typeof ZodEnum.VolunteerActivityStatus>
	applicationDeadline: Date
	managerId: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	maxParticipants: number | null
	qualifications: string | null
	materials: string | null
	manager?: ZodType<typeof UserEntitySchema>
	applications?: ZodType<typeof ApplicationEntitySchema>[] | null
}

export const VolunteerActivityEntitySchema: z.ZodMiniType<VolunteerActivityAttributes> =
	z.strictObject({
		id: z.string().check(z.cuid()),
		title: z.string().check(z.minLength(1), z.maxLength(255)),
		description: z.string().check(z.minLength(1)),
		startAt: z.date(),
		endAt: z.date(),
		location: z.string().check(z.minLength(1), z.maxLength(500)),
		status: ZodEnum.VolunteerActivityStatus,
		applicationDeadline: z.date(),
		managerId: z.string().check(z.cuid()),
		manager: z.optional(z.lazy(() => UserEntitySchema)),
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.nullable(z.date()),
		maxParticipants: z.number().check(z.positive()),
		qualifications: z.string(),
		materials: z.string(),
		applications: z.nullable(
			z.optional(z.array(z.lazy(() => ApplicationEntitySchema))),
		),
	})

export const VolunteerActivityListEntitySchema = z.array(
	VolunteerActivityEntitySchema,
)

export const VolunteerActivityListResponseSchema = z.object({
	volunteerActivityList: VolunteerActivityListEntitySchema,
	totalCount: z.number().check(z.nonnegative()),
})

export const VolunteerActivityFilterInputSchema = z.object({
	id: z.string().check(z.cuid('올바른 활동 ID가 아닙니다')),
})

export const VolunteerActivityListFilterInputSchema = z.optional(
	z.object({
		filter: z.optional(
			z.object({
				status: z.optional(z.string()),
				search: z.optional(z.string()),
				managerId: z.optional(z.string()),
				startDate: z.optional(z.date()),
				endDate: z.optional(z.date()),
			}),
		),
		pageable: z.optional(PageableSchema),
	}),
)

export const CreateVolunteerActivityInputSchema = z
	.object({
		title: z
			.string()
			.check(
				z.minLength(1, '활동명을 입력해주세요'),
				z.maxLength(255, '활동명은 255자 이내로 입력해주세요'),
			)
			.check(
				z.minLength(1, '활동 설명을 입력해주세요'),
				z.maxLength(2000, '활동 설명은 2000자 이내로 입력해주세요'),
			),
		description: z.string().check(z.minLength(1, '활동 설명을 입력해주세요')),
		startAt: z
			.date()
			.check(
				z.refine(
					(date) => new TZDate(date, 'UTC') > new TZDate(new Date(), 'UTC'),
					'시작 일시는 현재 시간보다 미래여야 합니다',
				),
			),
		endAt: z
			.date()
			.check(
				z.refine(
					(date) => new TZDate(date, 'UTC') > new TZDate(new Date(), 'UTC'),
					'종료 일시는 현재 시간보다 미래여야 합니다',
				),
			),
		location: z
			.string()
			.check(
				z.minLength(1, '활동 장소를 입력해주세요'),
				z.maxLength(500, '활동 장소는 500자 이내로 입력해주세요'),
			),
		applicationDeadline: z
			.date()
			.check(
				z.refine(
					(date) => new TZDate(date, 'UTC') > new TZDate(new Date(), 'UTC'),
					'신청 마감일은 현재 날짜보다 미래여야 합니다',
				),
			),
		maxParticipants: z.optional(
			z
				.number()
				.check(
					z.positive(),
					z.minimum(1, '최대 참가자 수는 1명 이상이어야 합니다'),
					z.maximum(1000, '최대 참가자 수는 1000명 이하여야 합니다'),
				),
		),
		qualifications: z.optional(
			z
				.string()
				.check(z.maxLength(1000, '참가 자격은 1000자 이내로 입력해주세요')),
		),
		materials: z.optional(
			z
				.string()
				.check(z.maxLength(1000, '준비물은 1000자 이내로 입력해주세요')),
		),
	})
	.check(
		z.refine(
			(data) => new TZDate(data.endAt, 'UTC') > new TZDate(data.startAt, 'UTC'),
			'종료 일시는 시작 일시보다 늦어야 합니다',
		),
	)
	.check(
		z.refine(
			(data) =>
				new TZDate(data.applicationDeadline, 'UTC') <
				new TZDate(data.startAt, 'UTC'),
			'신청 마감일은 활동 시작일보다 빨라야 합니다',
		),
	)

export const UpdateVolunteerActivityInputSchema = z.object({
	id: z.string().check(z.cuid('올바른 활동 ID가 아닙니다')),
	...z.partial(CreateVolunteerActivityInputSchema).shape,
})

export const DeleteVolunteerActivityInputSchema = z.object({
	id: z.string().check(z.cuid('올바른 활동 ID가 아닙니다')),
})
