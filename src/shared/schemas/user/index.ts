import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'

export const UserEntitySchema = z.strictObject({
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

export const UpdateUserInputSchema = z.object({
	name: z
		.string()
		.check(
			z.minLength(1, '이름을 입력해주세요'),
			z.maxLength(20, '이름은 20자 이내로 입력해주세요'),
		),
})

export const UserFormSchema = UpdateUserInputSchema

export const GetUserResponseSchema = UserEntitySchema
