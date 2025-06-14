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
