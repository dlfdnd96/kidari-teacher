import { ZodType } from '@/shared/types'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { ZodEnum } from '@/enums'

export interface MyApplicationsPageProps {
	searchParams: Promise<{
		page?: string
		status?: string
	}>
}

export interface ApplicationFormProps {
	volunteerActivityId: string
	volunteerActivityTitle: string
	onCancel: () => void
	onClose: () => void
}

export interface ApplicationModalProps {
	open: boolean
	onClose: () => void
	volunteerActivityId: string
	volunteerActivityTitle: string
}

export interface MyApplicationCardProps {
	application: ZodType<typeof ApplicationEntitySchema>
}

export interface MyApplicationListProps {
	applications: ZodType<typeof ApplicationEntitySchema>[]
	isLoading?: boolean
}

export interface ApplicationDetailModalProps {
	application: ZodType<typeof ApplicationEntitySchema>
	open: boolean
	onClose: () => void
	userRole: ZodType<typeof ZodEnum.Role> | undefined
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
