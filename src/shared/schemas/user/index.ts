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

export const UserProfileEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	userId: z.string().check(z.cuid()),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	phone: z.nullable(z.string()),
	birthDate: z.nullable(z.date()),
	organization: z.nullable(z.string()),
	address: z.nullable(z.string()),
})

export const UpdateUserInputSchema = z.object({
	name: z
		.string()
		.check(
			z.minLength(1, '이름을 입력해주세요'),
			z.maxLength(100, '이름은 100자 이내로 입력해주세요'),
		),
	email: z.string().check(z.email('올바른 이메일 형식이 아닙니다')),
})

export const GetCurrentUserResponseSchema = UserEntitySchema

export const UserProfileStatsSchema = z.object({
	totalApplications: z.number().check(z.nonnegative()),
	selectedApplications: z.number().check(z.nonnegative()),
	completedActivities: z.number().check(z.nonnegative()),
	memberSince: z.date(),
})

export const DeleteAccountInputSchema = z.object({
	confirmEmail: z.string().check(z.email('올바른 이메일 형식이 아닙니다')),
	confirmText: z.literal('계정을 삭제합니다'),
})

export const CreateUserProfileInputSchema = z.strictObject({
	phone: z.optional(z.string().check(z.minLength(0), z.maxLength(11))),
	birthDate: z.optional(z.date()),
	organization: z.optional(z.string().check(z.minLength(0), z.maxLength(255))),
	address: z.optional(z.string().check(z.minLength(0), z.maxLength(500))),
})

export const UpdateUserProfileInputSchema = CreateUserProfileInputSchema

export const GetUserProfileResponseSchema = UserProfileEntitySchema

export const HasUserProfileResponseSchema = z.strictObject({
	hasProfile: z.boolean(),
})
