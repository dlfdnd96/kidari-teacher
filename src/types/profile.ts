import { ZodType } from '@/shared/types'
import { UserEntitySchema, UserFormSchema } from '@/shared/schemas/user'
import React from 'react'

export interface ProfilePageClientProps {
	initialUser?: ZodType<typeof UserEntitySchema>
}

export interface ProfileFormProps {
	onCancel: () => void
	refetchUser: () => Promise<any>
}

export interface UseProfileFormProps {
	onSubmit: (data: ZodType<typeof UserFormSchema>) => Promise<void>
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

export interface ProfileEditState {
	isEditing: boolean
	isEditingUserProfile: boolean
}

export interface StatCardData {
	icon: React.ComponentType<{ className?: string }>
	title: string
	value: number | string
	description: string
	color: 'blue' | 'purple' | 'indigo'
	additionalInfo?: string
}
