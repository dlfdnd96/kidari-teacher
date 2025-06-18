import { z } from 'zod/v4-mini'
import { TZDate } from '@date-fns/tz'
import { PageableSchema } from '@/shared/schemas'
import { ZodEnum } from '@/enums'
import { UserEntitySchema } from '@/shared/schemas/user'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { TIME_ZONE } from '@/constants/date'
import { startOfDay } from 'date-fns'

export const VolunteerActivityEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	title: z.string().check(z.minLength(1), z.maxLength(255)),
	description: z.string().check(z.minLength(1)),
	startAt: z.date(),
	endAt: z.date(),
	location: z.string().check(z.minLength(1), z.maxLength(500)),
	status: ZodEnum.VolunteerActivityStatus,
	applicationDeadline: z.date(),
	managerId: z.string().check(z.cuid()),
	get manager(): z.ZodMiniOptional<typeof UserEntitySchema> {
		return z.optional(UserEntitySchema)
	},
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	maxParticipants: z.nullable(z.number().check(z.positive())),
	get applications(): z.ZodMiniOptional<
		z.ZodMiniNullable<z.ZodMiniArray<typeof ApplicationEntitySchema>>
	> {
		return z.optional(z.nullable(z.array(ApplicationEntitySchema)))
	},
})

export const VolunteerActivityListEntitySchema = z.array(
	VolunteerActivityEntitySchema,
)

export const VolunteerActivityListResponseSchema = z.strictObject({
	volunteerActivityList: VolunteerActivityListEntitySchema,
	totalCount: z.number().check(z.nonnegative()),
})

export const VolunteerActivityFilterInputSchema = z.strictObject({
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
	.strictObject({
		title: z
			.string()
			.check(
				z.minLength(1, '활동명을 입력해주세요'),
				z.maxLength(255, '활동명은 255자 이내로 입력해주세요'),
			),
		description: z
			.string()
			.check(
				z.minLength(1, '활동 설명을 입력해주세요'),
				z.maxLength(2000, '활동 설명은 2000자 이내로 입력해주세요'),
			),
		startAt: z
			.date()
			.check(
				z.refine(
					(date) =>
						new TZDate(date, TIME_ZONE.UTC) >
						new TZDate(new Date(), TIME_ZONE.UTC),
					'시작 일시는 현재 시간보다 미래여야 합니다',
				),
			),
		endAt: z
			.date()
			.check(
				z.refine(
					(date) =>
						new TZDate(date, TIME_ZONE.UTC) >
						new TZDate(new Date(), TIME_ZONE.UTC),
					'종료 일시는 현재 시간보다 미래여야 합니다',
				),
			),
		location: z
			.string()
			.check(
				z.minLength(1, '활동 장소를 입력해주세요'),
				z.maxLength(500, '활동 장소는 500자 이내로 입력해주세요'),
			),
		status: ZodEnum.VolunteerActivityStatus,
		applicationDeadline: z
			.date()
			.check(
				z.refine(
					(date) =>
						startOfDay(date) >=
						startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)),
					'신청 마감일은 어제 날짜보다 미래여야 합니다',
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
	})
	.check(
		z.refine(
			(data) =>
				new TZDate(data.endAt, TIME_ZONE.UTC) >
				new TZDate(data.startAt, TIME_ZONE.UTC),
			'종료 일시는 시작 일시보다 늦어야 합니다',
		),
	)
	.check(
		z.refine(
			(data) =>
				startOfDay(data.applicationDeadline) <
				startOfDay(new TZDate(data.startAt, TIME_ZONE.SEOUL)),
			'신청 마감일은 활동 시작일보다 빨라야 합니다',
		),
	)

export const UpdateVolunteerActivityInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 활동 ID가 아닙니다')),
	title: z
		.string()
		.check(
			z.minLength(1, '활동명을 입력해주세요'),
			z.maxLength(255, '활동명은 255자 이내로 입력해주세요'),
		),
	description: z
		.string()
		.check(
			z.minLength(1, '활동 설명을 입력해주세요'),
			z.maxLength(2000, '활동 설명은 2000자 이내로 입력해주세요'),
		),
	startAt: z
		.date()
		.check(
			z.refine(
				(date) =>
					new TZDate(date, TIME_ZONE.UTC) >
					new TZDate(new Date(), TIME_ZONE.UTC),
				'시작 일시는 현재 시간보다 미래여야 합니다',
			),
		),
	endAt: z
		.date()
		.check(
			z.refine(
				(date) =>
					new TZDate(date, TIME_ZONE.UTC) >
					new TZDate(new Date(), TIME_ZONE.UTC),
				'종료 일시는 현재 시간보다 미래여야 합니다',
			),
		),
	location: z
		.string()
		.check(
			z.minLength(1, '활동 장소를 입력해주세요'),
			z.maxLength(500, '활동 장소는 500자 이내로 입력해주세요'),
		),
	status: ZodEnum.VolunteerActivityStatus,
	applicationDeadline: z
		.date()
		.check(
			z.refine(
				(date) =>
					startOfDay(date) >=
					startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)),
				'신청 마감일은 어제 날짜보다 미래여야 합니다',
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
})

export const DeleteVolunteerActivityInputSchema = z.strictObject({
	id: z.string().check(z.cuid('올바른 활동 ID가 아닙니다')),
})

export const VolunteerActivityEditFormSchema =
	CreateVolunteerActivityInputSchema
