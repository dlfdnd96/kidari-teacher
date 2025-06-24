import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'

export const UserProfileEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	userId: z.string().check(z.cuid()),
	phone: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.nullable(z.date()),
	birthDate: z.nullable(z.date()),
	organization: z.nullable(z.string()),
})

export const UserProfileStatsSchema = z.object({
	totalApplications: z.number().check(z.nonnegative()),
	selectedApplications: z.number().check(z.nonnegative()),
	completedActivities: z.number().check(z.nonnegative()),
	memberSince: z.date(),
})

export const InitialUserProfileInputSchema = z.strictObject({
	name: z.string(),
	email: z.string().check(z.email()),
	phone: z.string().check(z.minLength(1), z.maxLength(11)),
	professions: z.array(ZodEnum.Profession),
	organization: z.optional(
		z.nullable(
			z.pipe(
				z.string().check(z.minLength(0), z.maxLength(255)),
				z.transform((organization) =>
					organization.trim() === '' ? null : organization,
				),
			),
		),
	),
})

export const CreateUserProfileInputSchema = z.strictObject({
	phone: z.string().check(z.minLength(0), z.maxLength(11)),
	professions: z.array(ZodEnum.Profession),
	organization: z.optional(
		z.nullable(
			z.pipe(
				z.string().check(z.minLength(0), z.maxLength(255)),
				z.transform((organization) =>
					organization.trim() === '' ? null : organization,
				),
			),
		),
	),
	birthDate: z.optional(z.nullable(z.date())),
})

export const UpdateUserProfileInputSchema = CreateUserProfileInputSchema

export const GetUserProfileResponseSchema = UserProfileEntitySchema

export const GetUserProfileWithProfessionsResponseSchema = z.strictObject({
	...UserProfileEntitySchema.def.shape,
	professions: z.array(ZodEnum.Profession),
})

export const HasUserProfileResponseSchema = z.strictObject({
	hasProfile: z.boolean(),
})
