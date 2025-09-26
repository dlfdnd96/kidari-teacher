import type { ZodType } from '@/types'
import { VolunteerActivityStatisticsListSchema } from '@/schemas/statistics'

export interface ActivityChange {
	thisMonth: ZodType<typeof VolunteerActivityStatisticsListSchema>
	lastMonth: ZodType<typeof VolunteerActivityStatisticsListSchema>
}
