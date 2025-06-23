import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { TZDate } from '@date-fns/tz'
import {
	GetUserResponseSchema,
	UpdateUserInputSchema,
} from '@/shared/schemas/user'
import { TIME_ZONE } from '@/constants/date'

export const userRouter = createTRPCRouter({
	getUser: protectedProcedure
		.output(GetUserResponseSchema)
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
	updateUser: protectedProcedure
		.input(UpdateUserInputSchema)
		.output(GetUserResponseSchema)
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

			return await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
					email: input.email,
					updatedAt: new TZDate(new Date(), TIME_ZONE.UTC),
				},
			})
		}),
})
