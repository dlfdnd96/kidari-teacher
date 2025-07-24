import type { ZodType } from '@/shared/types'
import {
	ApplicationEntitySchema,
	ApplicationFormSchema,
} from '@/shared/schemas/application'

export interface ApplicationFormProps {
	volunteerActivityId: string
	onSubmit: (data: ZodType<typeof ApplicationFormSchema>) => Promise<void>
	onCancel: () => void
	onSuccess: () => void
}

export interface ApplicationModalProps {
	open: boolean
	onClose: () => void
	volunteerActivityId: string
	volunteerActivityTitle: string
	onSuccess: () => void
}

export interface UseApplicationFormProps {
	onSubmit: (data: ZodType<typeof ApplicationFormSchema>) => Promise<void>
	onSuccess: () => void
}

export interface MyApplicationsPageProps {
	searchParams: Promise<{
		page?: string
		status?: string
	}>
}

export interface MyApplicationListRowProps {
	application: ZodType<typeof ApplicationEntitySchema>
}

export interface MyApplicationListProps {
	applications: ZodType<typeof ApplicationEntitySchema>[]
	isLoading?: boolean
}

export interface MyApplicationPageClientProps {
	initialPage: number
}

export const APPLICATION_STATUS_LABELS = {
	WAITING: '대기 중',
	SELECTED: '선발됨',
	REJECTED: '불합격',
} as const

export const APPLICATION_STATUS_COLORS = {
	WAITING: 'bg-yellow-100 text-yellow-800',
	SELECTED: 'bg-green-100 text-green-800',
	REJECTED: 'bg-red-100 text-red-800',
} as const
