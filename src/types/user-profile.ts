import { ZodType } from '@/shared/types'
import { UserProfileEntitySchema } from '@/shared/schemas/user-profile'

export interface UserProfileCardProps {
	profile: ZodType<typeof UserProfileEntitySchema> | null
	onEdit?: () => void
	onCreate?: () => void
	canEdit?: boolean
}

export interface UserProfileFormProps {
	onCancel: () => void
	isSetup: boolean
	initialData: ZodType<typeof UserProfileEntitySchema> | undefined
}
