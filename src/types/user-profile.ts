import { ZodType } from '@/shared/types'
import {
	GetUserProfileWithProfessionsResponseSchema,
	UserProfileFormSchema,
} from '@/shared/schemas/user-profile'
import type {
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form'
import { ZodEnum } from '@/enums'

export interface UserProfileCardProps {
	profile: ZodType<typeof GetUserProfileWithProfessionsResponseSchema> | null
	onEdit?: () => void
	onCreate?: () => void
	canEdit?: boolean
}

export interface UserProfileFormProps {
	onCancel: () => void
	isSetup: boolean
	userProfile?: ZodType<typeof GetUserProfileWithProfessionsResponseSchema>
}

export interface UseUserProfileFormProps {
	onSubmit: (data: ZodType<typeof UserProfileFormSchema>) => Promise<void>
	onCancel: () => void
	userProfile?: ZodType<typeof GetUserProfileWithProfessionsResponseSchema>
}

export interface FormHeaderProps {
	headerTitle: string
}

export interface PhoneFieldProps {
	displayPhone: string
	handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	loading: boolean
	errors: FieldErrors<ZodType<typeof UserProfileFormSchema>>
}

export interface ProfessionFieldProps {
	selectedProfessions: ZodType<typeof ZodEnum.Profession>[]
	handleProfessionsChange: (
		professions: ZodType<typeof ZodEnum.Profession>[],
	) => void
	loading: boolean
	errors: FieldErrors<ZodType<typeof UserProfileFormSchema>>
}

export interface OrganizationFieldProps {
	register: UseFormRegister<ZodType<typeof UserProfileFormSchema>>
	loading: boolean
}

export interface BirthDateFieldProps {
	birthDate: Date | null
	setValue: UseFormSetValue<ZodType<typeof UserProfileFormSchema>>
	userProfile?: ZodType<typeof GetUserProfileWithProfessionsResponseSchema>
	formattedDate: string | null
}

export interface ActionButtonsProps {
	loading: boolean
	onCancel?: () => void
	submitButtonText: string
}
