import { z } from 'zod/v4-mini'
import { ZodEnum } from '@/enums'
import { UserEntitySchema } from '@/shared/schemas/user'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { SelectionEntitySchema } from '@/shared/schemas/selection'
import { ZodType } from '@/shared/types'

interface ApplicationAttributes {
	id: string
	userId: string
	volunteerActivityId: string
	emergencyContact: string
	status: ZodType<typeof ZodEnum.ApplicationStatus>
	createdAt: Date
	updatedAt: Date
	deletedAt: Date | null
	user?: ZodType<typeof UserEntitySchema>
	volunteerActivity?: ZodType<typeof VolunteerActivityEntitySchema>
	selection?: ZodType<typeof SelectionEntitySchema> | null
}

export const ApplicationEntitySchema: z.ZodMiniType<ApplicationAttributes> =
	z.strictObject({
		id: z.string().check(z.cuid()),
		userId: z.string().check(z.cuid()),
		user: z.optional(z.lazy(() => UserEntitySchema)),
		volunteerActivityId: z.string().check(z.cuid()),
		volunteerActivity: z.optional(z.lazy(() => VolunteerActivityEntitySchema)),
		emergencyContact: z.string().check(z.minLength(1), z.maxLength(100)),
		status: ZodEnum.ApplicationStatus,
		createdAt: z.date(),
		updatedAt: z.date(),
		deletedAt: z.nullable(z.date()),
		selection: z.nullable(z.optional(z.lazy(() => SelectionEntitySchema))),
	})
