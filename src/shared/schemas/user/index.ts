import { z } from 'zod/mini'
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

export const CreateUserProfileFormSchema = z.strictObject({
	name: z
		.string()
		.check(
			z.minLength(1, '이름을 입력해주세요'),
			z.maxLength(20, '이름은 20자 이내로 입력해주세요'),
		),
	email: z.email('이메일을 확인해주세요'),
	phone: z
		.string()
		.check(
			z.minLength(8, '번호는 최소 8자리 이상으로 입력해주세요'),
			z.maxLength(11, '번호는 최대 11자리 이내로 입력해주세요'),
		),
	professions: z
		.array(ZodEnum.Profession, '올바른 직업을 선택해주세요')
		.check(z.minLength(1, '직업을 최소 1개 이상 선택해주세요')),
	organization: z.optional(
		z.nullable(
			z.pipe(
				z
					.string()
					.check(
						z.minLength(0, '소속 기관을 입력해주세요'),
						z.maxLength(255, '소속 기관은 최대 255자 이내로 입력해주세요'),
					),
				z.transform((organization) =>
					organization.trim() === '' ? null : organization,
				),
			),
		),
	),
})

export const GetUserResponseSchema = UserEntitySchema
