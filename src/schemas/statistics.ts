import * as z from 'zod/mini'
import { ZodEnum } from '@/enums'

export const VolunteerActivityStatisticsSchema = z.strictObject({
	date: z.iso.datetime(),
	year: z.number().check(z.positive()),
	month: z.number().check(z.minimum(1), z.maximum(12)),
	serviceName: z.string(),
	location: z.string(),
	category: z.enum(['진로', '봉사활동']),
	status: z.enum(['완료']),
	participants: z.array(z.string()),
})

export const VolunteerActivityStatisticsListSchema = z.array(
	VolunteerActivityStatisticsSchema,
)

export const RankingItemSchema = z.strictObject({
	id: z.string(),
	name: z.string(),
	score: z.number().check(z.nonnegative()),
	location: z.string(),
	category: z.string(),
	rank: z.number().check(z.positive()),
})

export const RankingListSchema = z.array(RankingItemSchema)

export const FilterOptionsSchema = z.strictObject({
	period: z.optional(
		z.strictObject({
			year: z.number(),
			month: z.optional(z.number().check(z.minimum(1), z.maximum(12))),
		}),
	),
	category: z.optional(ZodEnum.StatisticsFilterCategory),
	location: z.optional(z.string()),
})

export const PersonalStatsSchema = z.strictObject({
	totalActivities: z.number(),
	categories: z.array(z.string()),
	locations: z.array(z.string()),
	lastActivityDate: z.optional(z.string()),
	monthlyTrend: z.array(
		z.strictObject({
			month: z.string(),
			count: z.number(),
		}),
	),
	categoryDistribution: z.array(
		z.strictObject({
			category: z.string(),
			count: z.number(),
		}),
	),
	averageComparison: z.strictObject({
		personalAvg: z.number(),
		totalAvg: z.number(),
		percentile: z.number(),
	}),
})

export const PersonalTimelineItemSchema = z.strictObject({
	id: z.string(),
	date: z.string(),
	serviceName: z.string(),
	location: z.string(),
	category: z.enum(['진로', '봉사활동']),
	status: z.enum(['완료']),
})
