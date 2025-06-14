import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from '@/server/api/trpc'
import { TZDate } from '@date-fns/tz'
import {
	CreateNoticeInputSchema,
	DeleteNoticeInputSchema,
	NoticeListFilterInputSchema,
	NoticeListResponseSchema,
	UpdateNoticeInputSchema,
} from '@/shared/schemas/notice'
import { TRPCError } from '@trpc/server'
import { createDomainQueryBuilder } from '@/lib/query-builder'

export const noticeRouter = createTRPCRouter({
	getNoticeList: publicProcedure
		.input(NoticeListFilterInputSchema)
		.output(NoticeListResponseSchema)
		.query(async (opts) => {
			const { ctx, input } = opts

			const queryOptions = createDomainQueryBuilder(input)

			const noticeList = await ctx.prisma.notice.findMany({
				...queryOptions,
				include: { author: { select: { name: true } } },
			})
			const totalCount = await ctx.prisma.notice.count({
				where: {
					...queryOptions.where,
				},
			})
			return {
				noticeList,
				totalCount,
			}
		}),
	createNotice: adminProcedure
		.input(CreateNoticeInputSchema)
		.mutation(({ ctx, input }) => {
			return ctx.prisma.notice.create({
				data: {
					title: input.title,
					content: input.content,
					authorId: input.adminId,
					isPublished: true,
				},
			})
		}),
	updateNotice: adminProcedure
		.input(UpdateNoticeInputSchema)
		.mutation(async ({ ctx, input }) => {
			const notice = await ctx.prisma.notice.findUnique({
				where: { id: input.id, deletedAt: null },
			})
			if (!notice) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 공지사항입니다.',
				})
			}

			return ctx.prisma.notice.update({
				where: { id: input.id },
				data: {
					title: input.title,
					content: input.content,
				},
			})
		}),
	deleteNotice: adminProcedure
		.input(DeleteNoticeInputSchema)
		.mutation(async ({ ctx, input }) => {
			const notice = await ctx.prisma.notice.findUnique({
				where: { id: input.id, deletedAt: null },
			})
			if (!notice) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: '존재하지 않는 공지사항입니다.',
				})
			}

			return ctx.prisma.notice.update({
				where: { id: input.id },
				data: { deletedAt: new TZDate(new Date(), 'UTC') },
			})
		}),
})
