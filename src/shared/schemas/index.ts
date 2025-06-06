import { z } from 'zod/v4-mini'

export const PageableSchema = z.object({
	offset: z.optional(z.number().check(z.nonnegative())),
	limit: z.optional(
		z.number().check(z.positive(), z.minimum(1), z.maximum(100)),
	),
	sort: z.optional(z.record(z.string(), z.enum(['asc', 'desc']))),
})
