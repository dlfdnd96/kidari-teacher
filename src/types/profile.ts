import { ZodType } from '@/shared/types'
import { UserEntitySchema } from '@/shared/schemas/user'

export interface ProfilePageClientProps {
	initialUser?: ZodType<typeof UserEntitySchema>
}

export interface ProfileFormProps {
	onCancel: () => void
	refetchUser: () => Promise<any>
}

export interface ProfileCardProps {
	user: ZodType<typeof UserEntitySchema>
	onEdit: () => void
	canEdit?: boolean
}

export interface ProfileStatsProps {
	applicationCount: number
	participatedCount: number
	completedCount: number
	memberSince: Date
}
