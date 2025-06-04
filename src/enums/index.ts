import { z } from 'zod/v4'

export const Enum = {
	Role: z.enum(['ADMIN', 'USER']).enum,
}

export const ZodEnum = {
	Role: z.enum(['ADMIN', 'USER']),
}
