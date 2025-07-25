import { z } from 'zod/mini'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { UserEntitySchema } from '@/shared/schemas/user'

export const SelectionEntitySchema = z.strictObject({
	id: z.string().check(z.cuid()),
	applicationId: z.string().check(z.cuid()),
	get application(): z.ZodMiniOptional<typeof ApplicationEntitySchema> {
		return z.optional(ApplicationEntitySchema)
	},
	isSelected: z.boolean(),
	selectedById: z.string().check(z.cuid()),
	get selectedBy(): z.ZodMiniOptional<typeof UserEntitySchema> {
		return z.optional(UserEntitySchema)
	},
	createdAt: z.date(),
	updatedAt: z.date(),
	selectionOrder: z.nullable(z.number().check(z.nonnegative())),
	waitingOrder: z.nullable(z.number().check(z.nonnegative())),
	notes: z.nullable(z.string()),
})
