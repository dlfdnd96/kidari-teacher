import * as z from 'zod/mini'

export const Enum = {
	StatisticsFilterCategory: z.enum(['진로', '봉사활동', 'all']).def.entries,
}

export const ZodEnum = {
	StatisticsFilterCategory: z.enum(['진로', '봉사활동', 'all']),
}
