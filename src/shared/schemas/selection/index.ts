import { z } from 'zod/v4-mini'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { UserEntitySchema } from '@/shared/schemas/user'
import { ZodType } from '@/shared/types'

interface SelectionAttributes {
	id: string
	applicationId: string
	isSelected: boolean
	selectedById: string
	createdAt: Date
	updatedAt: Date
	selectionOrder: number | null
	waitingOrder: number | null
	notes: string | null
	application?: ZodType<typeof ApplicationEntitySchema>
	selectedBy?: ZodType<typeof UserEntitySchema>
}

export const SelectionEntitySchema: z.ZodMiniType<SelectionAttributes> =
	z.strictObject({
		id: z.string().check(z.cuid()),
		applicationId: z.string().check(z.cuid()),
		application: z.optional(z.lazy(() => ApplicationEntitySchema)),
		isSelected: z.boolean(),
		selectedById: z.string().check(z.cuid()),
		selectedBy: z.optional(z.lazy(() => UserEntitySchema)),
		createdAt: z.date(),
		updatedAt: z.date(),
		selectionOrder: z.nullable(z.number().check(z.nonnegative())),
		waitingOrder: z.nullable(z.number().check(z.nonnegative())),
		notes: z.nullable(z.string()),
	})
