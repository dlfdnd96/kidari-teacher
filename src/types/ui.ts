import { ZodType } from '@/shared/types'
import type { FeedbackProps } from '@/types/homepage'
import { ZodEnum } from '@/enums'

export interface ExtendedFeedbackProps extends FeedbackProps {
	className?: string
}

export interface ProfessionSelectorProps {
	selectedProfessions: ZodType<typeof ZodEnum.Profession>[]
	onProfessionsChange: (
		professions: ZodType<typeof ZodEnum.Profession>[],
	) => void
	disabled?: boolean
	className?: string
}

export interface FieldErrorProps {
	error?: string | null
	className?: string
	showIcon?: boolean
	id?: string
}

export interface FieldErrorListProps {
	errors: string[]
	className?: string
	showIcon?: boolean
}
