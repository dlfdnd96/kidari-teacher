import type { UseFormRegister, FieldError, Merge } from 'react-hook-form'
import type { ZodType } from '@/shared/types'
import { CreateUserProfileFormSchema } from '@/shared/schemas/user'
import { ZodEnum } from '@/enums'
import type React from 'react'

export interface BaseFieldProps {
	disabled?: boolean
	className?: string
}

export interface EmailFieldProps extends BaseFieldProps {
	register: UseFormRegister<ZodType<typeof CreateUserProfileFormSchema>>
}

export interface FormFieldProps extends BaseFieldProps {
	register: UseFormRegister<ZodType<typeof CreateUserProfileFormSchema>>
	error?: FieldError
}

export interface PhoneFieldProps extends BaseFieldProps {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: FieldError
}

export interface ProfessionFieldProps extends BaseFieldProps {
	selectedProfessions: ZodType<typeof ZodEnum.Profession>[]
	onProfessionsChange: (
		professions: ZodType<typeof ZodEnum.Profession>[],
	) => void
	error?: Merge<FieldError, (FieldError | undefined)[]>
}

export interface OrganizationFieldProps extends BaseFieldProps {
	register: UseFormRegister<ZodType<typeof CreateUserProfileFormSchema>>
}

export interface ProfileSetupFormProps {
	className?: string
}
