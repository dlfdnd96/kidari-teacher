import { z } from 'zod/v4-mini'

export const PageableSchema = z.object({
	offset: z.optional(z.number().check(z.nonnegative())),
	limit: z.optional(
		z.number().check(z.positive(), z.minimum(1), z.maximum(100)),
	),
	sort: z.optional(z.record(z.string(), z.enum(['asc', 'desc']))),
})

export const SearchTextSchema = z.tuple([
	z.pipe(
		z.string().check(z.endsWith('__like')),
		z.transform((key) => key.replace('__like', '')),
	),
	z.string(),
])

export const SearchDateRangeSchema = z.tuple([
	z.string(),
	z.object({
		from: z.iso.date(),
		to: z.iso.date(),
	}),
])

export const SearchDateTimeRangeSchema = z.tuple([
	z.string(),
	z.object({
		from: z.iso.datetime(),
		to: z.iso.datetime(),
	}),
])

export const SearchArraySchema = z.tuple([
	z.string(),
	z.array(z.any()).check(z.minLength(1)),
])
