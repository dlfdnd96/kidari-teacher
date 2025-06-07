import { z } from 'zod/v4-mini'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

export type ZodType<T extends z.ZodMiniType> = z.infer<T>

export type SortOptions = Record<string, 'asc' | 'desc'>

export interface PaginationOptions {
	offset?: number
	limit?: number
}

export interface PrismaPaginationOptions {
	skip?: number
	take?: number
}

interface CreateAppContextOptions {
	req: Request
}

export type CreateContextOptions =
	| CreateNextContextOptions
	| CreateAppContextOptions
