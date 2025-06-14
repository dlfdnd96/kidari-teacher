import { ZodType } from '@/shared/types'
import { UserEntitySchema, UpdateUserInputSchema } from '@/shared/schemas/user'

export interface ProfilePageClientProps {
	initialUser?: ZodType<typeof UserEntitySchema>
}

export interface ProfileFormProps {
	user: ZodType<typeof UserEntitySchema>
	onSubmit: (data: ZodType<typeof UpdateUserInputSchema>) => void
	onCancel: () => void
	isLoading?: boolean
}

export interface ProfileCardProps {
	user: ZodType<typeof UserEntitySchema>
	onEdit: () => void
	canEdit?: boolean
}

export interface ProfileStatsProps {
	applicationCount: number
	participatedCount: number
	memberSince: Date
}

export interface AccountSettingsProps {
	user: ZodType<typeof UserEntitySchema>
	onDeleteAccount?: () => void
}
