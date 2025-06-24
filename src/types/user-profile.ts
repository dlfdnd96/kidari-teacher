import { ZodType } from '@/shared/types'
import {
	GetUserProfileWithProfessionsResponseSchema,
	UserProfileEntitySchema,
} from '@/shared/schemas/user-profile'

export interface UserProfileCardProps {
	profile: ZodType<typeof GetUserProfileWithProfessionsResponseSchema> | null
	onEdit?: () => void
	onCreate?: () => void
	canEdit?: boolean
}

export interface UserProfileFormProps {
	onCancel: () => void
	isSetup: boolean
	initialData: ZodType<typeof UserProfileEntitySchema> | undefined
}
