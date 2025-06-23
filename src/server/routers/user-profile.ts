import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import {
	CreateUserProfileInputSchema,
	GetUserProfileResponseSchema,
	HasUserProfileResponseSchema,
	InitialUserProfileInputSchema,
	UpdateUserProfileInputSchema,
	UserProfileStatsSchema,
} from '@/shared/schemas/user-profile'

export const userProfileRouter = createTRPCRouter({
	getUserProfile: protectedProcedure
		.output(GetUserProfileResponseSchema)
		.query(async ({ ctx }) => {
			const profile = await ctx.prisma.userProfile.findFirst({
				where: {
					userId: ctx.session.user.id,
					deletedAt: null,
				},
			})

			if (!profile) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '프로필을 찾을 수 없습니다',
				})
			}

			return profile
		}),
	hasUserProfile: protectedProcedure
		.output(HasUserProfileResponseSchema)
		.query(async ({ ctx }) => {
			const profile = await ctx.prisma.userProfile.findFirst({
				where: {
					userId: ctx.session.user.id,
					deletedAt: null,
				},
			})

			return { hasProfile: !!profile }
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
				// FIXME: sql 최적화하기
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
	initializeUserProfile: protectedProcedure
		.input(InitialUserProfileInputSchema)
		.output(GetUserProfileResponseSchema)
		.mutation(async ({ ctx, input }) => {
			const profile = await ctx.prisma.userProfile.findFirst({
				where: {
					userId: ctx.session.user.id,
					deletedAt: null,
				},
			})

			if (profile) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: '이미 프로필이 존재합니다',
				})
			}

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

			await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
					email: input.email,
				},
			})

			return await ctx.prisma.userProfile.create({
				data: {
					userId: ctx.session.user.id,
					phone: input.phone,
					organization: input.organization,
				},
			})
		}),
	createUserProfile: protectedProcedure
		.input(CreateUserProfileInputSchema)
		.output(GetUserProfileResponseSchema)
		.mutation(async ({ ctx, input }) => {
			const profile = await ctx.prisma.userProfile.findFirst({
				where: {
					userId: ctx.session.user.id,
					deletedAt: null,
				},
			})

			if (profile) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: '이미 프로필이 존재합니다',
				})
			}

			return await ctx.prisma.userProfile.create({
				data: {
					userId: ctx.session.user.id,
					...input,
				},
			})
		}),
	updateUserProfile: protectedProcedure
		.input(UpdateUserProfileInputSchema)
		.output(GetUserProfileResponseSchema)
		.mutation(async ({ ctx, input }) => {
			const profile = await ctx.prisma.userProfile.findFirst({
				where: {
					userId: ctx.session.user.id,
					deletedAt: null,
				},
			})

			if (!profile) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '프로필을 찾을 수 없습니다',
				})
			}

			return await ctx.prisma.userProfile.update({
				where: {
					id: profile.id,
				},
				data: input,
			})
		}),
})
