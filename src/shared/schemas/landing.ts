import * as z from 'zod/mini'

export const ActivityRecordHistorySchema = z.strictObject({
	id: z.number().check(z.positive()),
	year: z.number().check(z.positive()),
	school: z.string(),
	location: z.string(),
	dates: z.array(z.iso.date()),
	status: z.enum(['완료', '2학기 예정']),
	type: z.enum(['고등학교', '봉사활동']),
})

export const ActivityRecordHistoryListSchema = z.strictObject({
	activities: z.array(ActivityRecordHistorySchema),
})

export const ActivityRecordSummarySchema = z.strictObject({
	summary: z.strictObject({
		totalActivities: z.number().check(z.positive()),
		years: z.array(z.number().check(z.positive())),
		schoolCount: z.number().check(z.positive()),
		volunteerCount: z.number().check(z.positive()),
		locations: z.array(z.string()),
	}),
})

export const ActivityRecordSchema = z.strictObject({
	...ActivityRecordHistoryListSchema.shape,
	...ActivityRecordSummarySchema.shape,
})

export const VolunteerActivityHistorySchema = z.strictObject({
	date: z.iso.datetime(),
	year: z.number().check(z.positive()),
	month: z.number().check(z.minimum(1), z.maximum(12)),
	serviceName: z.string(),
	location: z.string(),
	category: z.enum(['진로', '봉사활동']),
	status: z.enum(['완료']),
	participants: z.array(z.string()),
})

export const VolunteerActivityHistoryListSchema = z.array(
	VolunteerActivityHistorySchema,
)
