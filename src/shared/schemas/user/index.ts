import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'

interface UserAttributes {
	id: string
	role: ZodType<typeof ZodEnum.Role>
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	image: string | null
	name: string | null
	email: string | null
	emailVerified: Date | null
}

export const UserEntitySchema: z.ZodMiniType<UserAttributes> = z.strictObject({
	id: z.string().check(z.cuid()),
	role: ZodEnum.Role,
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	image: z.nullable(z.string()),
	name: z.nullable(z.string()),
	email: z.nullable(z.string()),
	emailVerified: z.nullable(z.date()),
})
