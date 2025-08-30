import { z } from 'zod/mini'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

export type ZodType<T extends z.ZodMiniType> = z.infer<T>

interface CreateAppContextOptions {
	req: Request
}

export type CreateContextOptions =
	| CreateNextContextOptions
	| CreateAppContextOptions
