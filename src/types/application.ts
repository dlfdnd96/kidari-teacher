import { ZodType } from '@/shared/types'
import {
	ApplicationEntitySchema,
	ApplicationFormSchema,
} from '@/shared/schemas/application'

export interface ApplicationFormProps {
	volunteerActivityId: string
	volunteerActivityTitle: string
	onSubmit: (data: ZodType<typeof ApplicationFormSchema>) => void
	onCancel: () => void
	isLoading?: boolean
}

export interface ApplicationModalProps {
	open: boolean
	onClose: () => void
	volunteerActivityId: string
	volunteerActivityTitle: string
}

export interface ApplicationCardProps {
	application: ZodType<typeof ApplicationEntitySchema>
	onViewDetail?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	onUpdateStatus?: (
		application: ZodType<typeof ApplicationEntitySchema>,
		status: string,
	) => void
	onDelete?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
	showActions?: boolean
}

export interface ApplicationListProps {
	applications: ZodType<typeof ApplicationEntitySchema>[]
	totalCount: number
	onViewDetail?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	onUpdateStatus?: (
		application: ZodType<typeof ApplicationEntitySchema>,
		status: string,
	) => void
	onDelete?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
	isLoading?: boolean
}

export interface MyApplicationCardProps {
	application: ZodType<typeof ApplicationEntitySchema>
	onViewDetail?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	onCancel?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	currentUserId?: string
}

export interface MyApplicationListProps {
	applications: ZodType<typeof ApplicationEntitySchema>[]
	totalCount: number
	onViewDetail?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	onCancel?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	currentUserId?: string
	isLoading?: boolean
}

export interface ApplicationDetailModalProps {
	application: ZodType<typeof ApplicationEntitySchema> | null
	open: boolean
	onClose: () => void
	onUpdateStatus?: (
		application: ZodType<typeof ApplicationEntitySchema>,
		status: string,
	) => void
	onDelete?: (application: ZodType<typeof ApplicationEntitySchema>) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
}

export interface ApplicationPageClientProps {
	isAdmin: boolean
	initialPage?: number
}

export interface MyApplicationPageClientProps {
	initialPage?: number
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

export const APPLICATION_STATUS_DESCRIPTIONS = {
	WAITING: '신청이 접수되어 검토 중입니다',
	SELECTED: '축하합니다! 봉사활동에 선발되었습니다',
	REJECTED: '아쉽게도 이번 활동에 선발되지 않았습니다',
} as const
