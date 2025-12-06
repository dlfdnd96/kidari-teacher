import * as z from 'zod/mini'

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
