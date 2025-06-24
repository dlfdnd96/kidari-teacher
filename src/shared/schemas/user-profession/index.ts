import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'

export const UserProfessionEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	userId: z.string().check(z.cuid()),
	profession: ZodEnum.Profession,
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
})
