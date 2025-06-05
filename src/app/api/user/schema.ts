import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'

export const UserEntitySchema = z.strictObject({
	id: z.string(),
	role: ZodEnum.Role,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	deletedAt: z.nullable(z.iso.datetime()),
	image: z.nullable(z.string()),
	name: z.nullable(z.string()),
	email: z.nullable(z.string()),
	emailVerified: z.nullable(z.iso.datetime()),
})
