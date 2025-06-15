import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { TZDate } from '@date-fns/tz'
import {
	UpdateUserInputSchema,
	GetCurrentUserResponseSchema,
	UserProfileStatsSchema,
	DeleteAccountInputSchema,
} from '@/shared/schemas/user'
import { TIME_ZONE } from '@/constants/date'

export const userRouter = createTRPCRouter({
	getCurrentUser: protectedProcedure
		.output(GetCurrentUserResponseSchema)
		.query(async ({ ctx }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					id: ctx.session.user.id,
					deletedAt: null,
				},
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '사용자를 찾을 수 없습니다',
				})
			}

			return user
		}),
	getProfileStats: protectedProcedure
		.output(UserProfileStatsSchema)
		.query(async ({ ctx }) => {
			const [
				totalApplications,
				selectedApplications,
				completedActivities,
				user,
			] = await Promise.all([
				ctx.prisma.application.count({
					where: {
						userId: ctx.session.user.id,
						deletedAt: null,
					},
				}),
				ctx.prisma.application.count({
					where: {
						userId: ctx.session.user.id,
						status: 'SELECTED',
						deletedAt: null,
					},
				}),
				ctx.prisma.application.count({
					where: {
						userId: ctx.session.user.id,
						status: 'SELECTED',
						deletedAt: null,
						volunteerActivity: {
							status: 'COMPLETED',
						},
					},
				}),
				ctx.prisma.user.findUnique({
					where: {
						id: ctx.session.user.id,
					},
					select: {
						createdAt: true,
					},
				}),
			])

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '사용자를 찾을 수 없습니다',
				})
			}

			return {
				totalApplications,
				selectedApplications,
				completedActivities,
				memberSince: user.createdAt,
			}
		}),
	getAllUsers: adminProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.user.findMany({
			where: {
				deletedAt: null,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				_count: {
					select: {
						applications: {
							where: {
								deletedAt: null,
							},
						},
					},
				},
			},
		})
	}),
	updateProfile: protectedProcedure
		.input(UpdateUserInputSchema)
		.output(GetCurrentUserResponseSchema)
		.mutation(async ({ ctx, input }) => {
			const existingUser = await ctx.prisma.user.findFirst({
				where: {
					email: input.email,
					id: {
						not: ctx.session.user.id,
					},
					deletedAt: null,
				},
			})

			if (existingUser) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: '이미 사용 중인 이메일입니다',
				})
			}

			const updatedUser = await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
					email: input.email,
					updatedAt: new TZDate(new Date(), TIME_ZONE.UTC),
				},
			})

			return updatedUser
		}),
	deleteAccount: protectedProcedure
		.input(DeleteAccountInputSchema)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					id: ctx.session.user.id,
				},
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '사용자를 찾을 수 없습니다',
				})
			}

			if (input.confirmEmail !== user.email) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: '이메일이 일치하지 않습니다',
				})
			}

			const activeApplications = await ctx.prisma.application.count({
				where: {
					userId: ctx.session.user.id,
					status: 'SELECTED',
					deletedAt: null,
					volunteerActivity: {
						status: {
							in: ['RECRUITING', 'SELECTED', 'IN_PROGRESS'],
						},
					},
				},
			})

			if (activeApplications > 0) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message:
						'진행 중인 봉사활동이 있어 계정을 삭제할 수 없습니다. 활동 완료 후 다시 시도해주세요.',
				})
			}

			await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					deletedAt: new TZDate(new Date(), TIME_ZONE.UTC),
				},
			})

			return { success: true }
		}),
})
