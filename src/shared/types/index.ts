import { z } from 'zod/v4-mini'

export type ZodType<T extends z.ZodMiniType> = z.infer<T>
