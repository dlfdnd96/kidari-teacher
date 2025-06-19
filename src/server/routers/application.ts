import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { createDomainQueryBuilder } from '@/lib/query-builder'
import { TZDate } from '@date-fns/tz'
import {
	CreateApplicationInputSchema,
	UpdateApplicationStatusInputSchema,
	DeleteApplicationInputSchema,
	ApplicationFilterInputSchema,
	ApplicationListFilterInputSchema,
	MyApplicationListFilterInputSchema,
	ApplicationEntitySchema,
	ApplicationListResponseSchema,
	MyApplicationListResponseSchema,
} from '@/shared/schemas/application'
import { TIME_ZONE } from '@/constants/date'
import { Enum } from '@/enums'
import { startOfDay } from 'date-fns'

export const applicationRouter = createTRPCRouter({
	getApplication: protectedProcedure
		.input(ApplicationFilterInputSchema)
		.output(ApplicationEntitySchema)
		.query(async ({ ctx, input }) => {
			const application = await ctx.prisma.application.findFirst({
				where: {
					id: input.id,
					deletedAt: null,
				},
			})

			if (!application) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 신청입니다',
				})
			}

			if (
				ctx.session.user.role !== Enum.Role.ADMIN &&
				application.userId !== ctx.session.user.id
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: '접근 권한이 없습니다',
				})
			}

			return application
		}),
	getApplicationList: protectedProcedure
		.input(ApplicationListFilterInputSchema)
		.output(ApplicationListResponseSchema)
		.query(async ({ ctx, input }) => {
			const queryOptions = createDomainQueryBuilder(input)

			const [applicationList, totalCount] = await Promise.all([
				ctx.prisma.application.findMany({
					...queryOptions,
					include: {
						user: true,
					},
				}),
				ctx.prisma.application.count({
					where: queryOptions.where,
				}),
			])

			return {
				applicationList,
				totalCount,
			}
		}),
	getMyApplicationList: protectedProcedure
		.input(MyApplicationListFilterInputSchema)
		.output(MyApplicationListResponseSchema)
		.query(async ({ ctx, input }) => {
			const queryOptions = createDomainQueryBuilder({
				filter: {
					userId: ctx.session.user.id,
					...input?.filter,
				},
				pageable: input?.pageable,
			})

			const [myApplicationList, totalCount] = await Promise.all([
				ctx.prisma.application.findMany({
					...queryOptions,
					where: {
						...queryOptions.where,
						volunteerActivity: {
							is: {
								deletedAt: null,
							},
						},
					},
					include: {
						volunteerActivity: true,
					},
				}),
				ctx.prisma.application.count({
					where: queryOptions.where,
				}),
			])

			return {
				myApplicationList,
				totalCount,
			}
		}),
	createApplication: protectedProcedure
		.input(CreateApplicationInputSchema)
		.mutation(async ({ ctx, input }) => {
			const volunteerActivity = await ctx.prisma.volunteerActivity.findFirst({
				where: {
					id: input.volunteerActivityId,
					deletedAt: null,
				},
				include: {
					applications: {
						where: { deletedAt: null },
						select: { id: true, userId: true },
					},
				},
			})

			if (!volunteerActivity) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 봉사활동입니다',
				})
			}

			if (
				startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) >
				startOfDay(volunteerActivity.applicationDeadline)
			) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '신청 마감일이 지났습니다',
				})
			}
			if (volunteerActivity.status !== 'RECRUITING') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '현재 신청을 받지 않는 상태입니다',
				})
			}

			const existingApplication = volunteerActivity.applications.find(
				(app) => app.userId === ctx.session.user.id,
			)
			if (existingApplication) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '이미 신청하신 봉사활동입니다',
				})
			}

			if (volunteerActivity.maxParticipants) {
				const currentApplicationCount = volunteerActivity.applications.length
				if (currentApplicationCount >= volunteerActivity.maxParticipants) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: '신청 정원이 마감되었습니다',
					})
				}
			}

			return await ctx.prisma.application.create({
				data: {
					userId: ctx.session.user.id,
					volunteerActivityId: input.volunteerActivityId,
					emergencyContact: input.emergencyContact,
					status: Enum.ApplicationStatus.WAITING,
				},
			})
		}),
	updateApplicationStatus: adminProcedure
		.input(UpdateApplicationStatusInputSchema)
		.mutation(async ({ ctx, input }) => {
			const applications = await ctx.prisma.application.findMany({
				where: {
					id: {
						in: input.ids,
					},
					deletedAt: null,
				},
			})

			if (applications.length !== input.ids.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 신청입니다',
				})
			}

			return await ctx.prisma.application.updateMany({
				where: { id: { in: input.ids } },
				data: {
					status: input.status,
				},
			})
		}),
	deleteApplication: protectedProcedure
		.input(DeleteApplicationInputSchema)
		.mutation(async ({ ctx, input }) => {
			const application = await ctx.prisma.application.findFirst({
				where: {
					id: input.id,
					deletedAt: null,
					volunteerActivity: {
						is: {
							deletedAt: null,
						},
					},
				},
				include: {
					volunteerActivity: true,
				},
			})

			if (!application) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 신청입니다',
				})
			}

			if (
				ctx.session.user.role !== Enum.Role.ADMIN &&
				application.userId !== ctx.session.user.id
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: '본인의 신청만 취소할 수 있습니다',
				})
			}

			if (application.status === 'SELECTED') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '이미 선발된 신청은 취소할 수 없습니다',
				})
			}

			if (
				new TZDate(new Date(), TIME_ZONE.UTC) >=
				new TZDate(application.volunteerActivity.startAt, TIME_ZONE.UTC)
			) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '활동이 시작된 후에는 신청을 취소할 수 없습니다',
				})
			}

			return await ctx.prisma.application.update({
				where: { id: input.id },
				data: {
					deletedAt: new TZDate(new Date(), TIME_ZONE.UTC),
				},
			})
		}),
})
