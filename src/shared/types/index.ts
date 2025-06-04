import { z } from 'zod/v4'

export type ZodType<T extends z.ZodType> = z.infer<T>
