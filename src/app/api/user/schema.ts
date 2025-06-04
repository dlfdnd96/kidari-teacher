import { z } from 'zod/v4'
import { ZodEnum } from '@/enums'

export const UserEntitySchema = z
	.object({
		id: z.string(),
		role: ZodEnum.Role,
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
		deletedAt: z.iso.datetime().nullable(),
		image: z.string().nullable(),
		name: z.string().nullable(),
		email: z.string().nullable(),
		emailVerified: z.iso.datetime().nullable(),
	})
	.strict()
