import { z } from 'zod/mini'

export type ZodType<T extends z.ZodMiniType> = z.infer<T>
