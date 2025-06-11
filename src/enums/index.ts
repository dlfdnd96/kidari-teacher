import { z } from 'zod/v4-mini'

export const Enum = {
	Role: z.enum(['ADMIN', 'USER']).def.entries,
	TestDataType: z.enum(['notices', 'users', 'sessions', 'all', 'test-data']).def
		.entries,
}

export const ZodEnum = {
	Role: z.enum(['ADMIN', 'USER']),
	TestDataType: z.enum(['notices', 'users', 'sessions', 'all', 'test-data']),
}
