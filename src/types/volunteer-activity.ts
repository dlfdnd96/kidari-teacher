import { Enum, ZodEnum } from '@/enums'
import { VolunteerActivityEntitySchema } from '@/shared/schemas/volunteer-activity'
import { ZodType } from '@/shared/types'
import {
	Calendar,
	CheckCircle,
	CheckCircle2,
	Play,
	Users,
	X,
} from 'lucide-react'

export interface VolunteerActivitiesPageProps {
	searchParams: Promise<{
		page?: string
		status?: string
		search?: string
	}>
}

export interface VolunteerActivityFilterTabProps {
	selectedStatus: string | 'all'
	statusChangeAction: (status: string | 'all') => void
	allStatusCount: number
	searchQuery: string
	searchChangeAction: (query: string) => void
}

export interface VolunteerActivityCardProps {
	activity: ZodType<typeof VolunteerActivityEntitySchema>
	onViewDetail: (
		activity: ZodType<typeof VolunteerActivityEntitySchema>,
	) => void
	onApply?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onEdit?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onDelete?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
}

export interface VolunteerActivityListProps {
	activities: ZodType<typeof VolunteerActivityEntitySchema>[]
	totalCount: number
	onViewDetail: (
		activity: ZodType<typeof VolunteerActivityEntitySchema>,
	) => void
	onApply?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onEdit?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onDelete?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onCreate?: () => void
}

export interface VolunteerActivityDetailModalProps {
	activity: ZodType<typeof VolunteerActivityEntitySchema>
	open: boolean
	onClose: () => void
	onApply?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
}

export interface VolunteerActivityFormProps {
	onClose: () => void
}

export interface VolunteerActivityEditFormProps {
	id: string
	initialTitle: string
	initialDescription: string
	initialStartAt: Date
	initialEndAt: Date
	initialLocation: string
	initialStatus: ZodType<typeof ZodEnum.VolunteerActivityStatus>
	initialApplicationDeadline: Date
	initialMaxParticipants?: number
	onCancel: () => void
}

export interface CreateVolunteerActivityModalProps {
	open: boolean
	onClose: () => void
}

export interface VolunteerActivityPageClientProps {
	isAdmin: boolean
	initialPage?: number
}

export const VOLUNTEER_ACTIVITY_FILTER_OPTIONS = [
	{
		value: Enum.VolunteerActivityStatus.RECRUITING,
		label: '모집 중',
		icon: Users,
		color: 'bg-emerald-500',
		variant: 'default' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.IN_PROGRESS,
		label: '진행 중',
		icon: Play,
		color: 'bg-orange-500',
		variant: 'secondary' as const,
	},
	{
		value: 'all',
		label: '전체',
		icon: Calendar,
		color: 'bg-blue-500',
		variant: 'outline' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.COMPLETED,
		label: '완료',
		icon: CheckCircle,
		color: 'bg-gray-500',
		variant: 'outline' as const,
	},
] as const

export const VOLUNTEER_ACTIVITY_STATUS_CONFIG = {
	[Enum.VolunteerActivityStatus.RECRUITING]: {
		color: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10',
		icon: Users,
		iconColor: 'text-emerald-600',
		badgeColor:
			'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
	},
	[Enum.VolunteerActivityStatus.PLANNING]: {
		color: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
		icon: Calendar,
		iconColor: 'text-blue-600',
		badgeColor:
			'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
	},
	[Enum.VolunteerActivityStatus.IN_PROGRESS]: {
		color: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10',
		icon: Play,
		iconColor: 'text-orange-600',
		badgeColor:
			'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
	},
	[Enum.VolunteerActivityStatus.COMPLETED]: {
		color: 'border-l-gray-500 bg-gray-50/50 dark:bg-gray-900/10',
		icon: CheckCircle2,
		iconColor: 'text-gray-600',
		badgeColor:
			'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
	},
	[Enum.VolunteerActivityStatus.CANCELLED]: {
		color: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
		icon: X,
		iconColor: 'text-red-600',
		badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
	},
	[Enum.VolunteerActivityStatus.SELECTED]: {
		color: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10',
		icon: CheckCircle2,
		iconColor: 'text-purple-600',
		badgeColor:
			'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
	},
}

export const VOLUNTEER_ACTIVITY_STATUS_LABELS = {
	[Enum.VolunteerActivityStatus.PLANNING]: '일정 계획 중',
	[Enum.VolunteerActivityStatus.RECRUITING]: '신청 접수 중',
	[Enum.VolunteerActivityStatus.SELECTED]: '선발 완료',
	[Enum.VolunteerActivityStatus.IN_PROGRESS]: '교육 진행 중',
	[Enum.VolunteerActivityStatus.COMPLETED]: '완료',
	[Enum.VolunteerActivityStatus.CANCELLED]: '취소됨',
} as const

export const VOLUNTEER_ACTIVITY_STATUS_COLORS = {
	[Enum.VolunteerActivityStatus.PLANNING]: 'bg-gray-100 text-gray-800',
	[Enum.VolunteerActivityStatus.RECRUITING]: 'bg-blue-100 text-blue-800',
	[Enum.VolunteerActivityStatus.SELECTED]: 'bg-green-100 text-green-800',
	[Enum.VolunteerActivityStatus.IN_PROGRESS]: 'bg-cyan-100 text-cyan-800',
	[Enum.VolunteerActivityStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800',
	[Enum.VolunteerActivityStatus.CANCELLED]: 'bg-red-100 text-red-800',
} as const

export const VOLUNTEER_ACTIVITY_STATUS_ORDER = [
	Enum.VolunteerActivityStatus.RECRUITING,
	Enum.VolunteerActivityStatus.PLANNING,
	Enum.VolunteerActivityStatus.IN_PROGRESS,
	Enum.VolunteerActivityStatus.SELECTED,
	Enum.VolunteerActivityStatus.COMPLETED,
	Enum.VolunteerActivityStatus.CANCELLED,
] as const

export const VOLUNTEER_ACTIVITY_LIST_STATUS_LABELS = {
	[Enum.VolunteerActivityStatus.RECRUITING]: '모집 중인 활동',
	[Enum.VolunteerActivityStatus.PLANNING]: '계획 중인 활동',
	[Enum.VolunteerActivityStatus.IN_PROGRESS]: '진행 중인 활동',
	[Enum.VolunteerActivityStatus.SELECTED]: '선발 완료된 활동',
	[Enum.VolunteerActivityStatus.COMPLETED]: '완료된 활동',
	[Enum.VolunteerActivityStatus.CANCELLED]: '취소된 활동',
} as const
