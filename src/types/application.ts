import { ZodType } from '@/shared/types'
import { ApplicationEntitySchema } from '@/shared/schemas/application'
import { Enum, ZodEnum } from '@/enums'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

export interface MyApplicationsPageProps {
	searchParams: Promise<{
		page?: string
		status?: string
	}>
}

export interface MyApplicationFilterTabProps {
	selectedStatus: string | 'all'
	statusChangeAction: (status: string | 'all') => void
	allStatusCount: number
}

export interface ApplicationFormProps {
	volunteerActivityId: string
	volunteerActivityTitle: string
	onCancel: () => void
	onClose: () => void
	onSuccess: () => void
}

export interface ApplicationModalProps {
	open: boolean
	onClose: () => void
	volunteerActivityId: string
	volunteerActivityTitle: string
	onSuccess: () => void
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

export const MY_APPLICATION_FILTER_OPTIONS = [
	{
		value: 'all',
		label: '전체',
		icon: FileText,
		color: 'bg-gray-500',
	},
	{
		value: Enum.ApplicationStatus.WAITING,
		label: '대기중',
		icon: Clock,
		color: 'bg-yellow-500',
	},
	{
		value: Enum.ApplicationStatus.SELECTED,
		label: '승인됨',
		icon: CheckCircle,
		color: 'bg-green-500',
	},
	{
		value: Enum.ApplicationStatus.REJECTED,
		label: '거절됨',
		icon: XCircle,
		color: 'bg-red-500',
	},
] as const

export const MY_APPLICATION_LIST_STATUS_LABELS = {
	[Enum.ApplicationStatus.WAITING]: '대기중인 신청',
	[Enum.ApplicationStatus.SELECTED]: '승인된 신청',
	[Enum.ApplicationStatus.REJECTED]: '거절된 신청',
} as const

export const MY_APPLICATION_STATUS_ORDER = [
	Enum.ApplicationStatus.WAITING,
	Enum.ApplicationStatus.SELECTED,
	Enum.ApplicationStatus.REJECTED,
] as const
