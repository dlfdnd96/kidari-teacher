import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { createDomainQueryBuilder } from '@/lib/query-builder'
import {
	CreateVolunteerActivityInputSchema,
	UpdateVolunteerActivityInputSchema,
	VolunteerActivityListFilterInputSchema,
	VolunteerActivityFilterInputSchema,
	DeleteVolunteerActivityInputSchema,
	VolunteerActivityEntitySchema,
	VolunteerActivityListResponseSchema,
} from '@/shared/schemas/volunteer-activity'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { Enum } from '@/enums'

export const volunteerActivityRouter = createTRPCRouter({
	getVolunteerActivity: protectedProcedure
		.input(VolunteerActivityFilterInputSchema)
		.output(VolunteerActivityEntitySchema)
		.query(async ({ ctx, input }) => {
			const activity = await ctx.prisma.volunteerActivity.findFirst({
				where: {
					id: input.id,
					deletedAt: null,
				},
			})

			if (!activity) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 봉사활동입니다',
				})
			}

			return activity
		}),
	getVolunteerActivityList: protectedProcedure
		.input(VolunteerActivityListFilterInputSchema)
		.output(VolunteerActivityListResponseSchema)
		.query(async ({ ctx, input }) => {
			const queryOptions = createDomainQueryBuilder(input)

			const [volunteerActivityList, totalCount] = await Promise.all([
				ctx.prisma.volunteerActivity.findMany({
					...queryOptions,
					include: {
						applications: {
							where: {
								deletedAt: null,
								user: {
									is: {
										deletedAt: null,
									},
								},
							},
							include: {
								user: true,
							},
						},
					},
				}),
				ctx.prisma.volunteerActivity.count({
					where: queryOptions.where,
				}),
			])

			return {
				volunteerActivityList,
				totalCount,
			}
		}),
	createVolunteerActivity: adminProcedure
		.input(CreateVolunteerActivityInputSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.volunteerActivity.create({
				data: {
					...input,
					managerId: ctx.session.user.id,
				},
			})
		}),
	updateVolunteerActivity: adminProcedure
		.input(UpdateVolunteerActivityInputSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input
			const volunteerActivity = await ctx.prisma.volunteerActivity.findUnique({
				where: {
					id,
					deletedAt: null,
				},
			})

			if (!volunteerActivity) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 봉사활동입니다',
				})
			}
			if (
				ctx.session.user.role !== Enum.Role.ADMIN &&
				volunteerActivity.managerId !== ctx.session.user.id
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: '관리자만 봉사활동을 수정할 수 있습니다',
				})
			}

			return await ctx.prisma.volunteerActivity.update({
				where: { id },
				data: updateData,
			})
		}),
	deleteVolunteerActivity: adminProcedure
		.input(DeleteVolunteerActivityInputSchema)
		.mutation(async ({ ctx, input }) => {
			const volunteerActivity = await ctx.prisma.volunteerActivity.findUnique({
				where: {
					id: input.id,
					deletedAt: null,
				},
			})

			if (!volunteerActivity) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '봉사활동을 찾을 수 없습니다',
				})
			}
			if (
				ctx.session.user.role !== Enum.Role.ADMIN &&
				volunteerActivity.managerId !== ctx.session.user.id
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: '삭제 권한이 없습니다',
				})
			}

			return await ctx.prisma.volunteerActivity.update({
				where: { id: input.id },
				data: {
					deletedAt: new TZDate(new Date(), TIME_ZONE.UTC),
				},
			})
		}),
})
