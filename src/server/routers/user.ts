import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import {
	GetUserResponseSchema,
	UpdateUserInputSchema,
} from '@/shared/schemas/user'

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

			return await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
				},
			})
		}),
})
