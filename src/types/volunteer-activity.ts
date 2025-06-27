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
	searchQuery: string
	searchChangeAction: (query: string) => void
}

export interface VolunteerActivityDetailPageProps {
	params: Promise<{ id: string }>
}

export interface VolunteerActivityDetailProps {
	id: string
}

export interface VolunteerActivityCardProps {
	activity: ZodType<typeof VolunteerActivityEntitySchema>
	onViewDetail: (
		activity: ZodType<typeof VolunteerActivityEntitySchema>,
	) => void
	onApply: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
}

export interface VolunteerActivityListProps {
	activities: ZodType<typeof VolunteerActivityEntitySchema>[]
	totalCount: number
	onViewDetail: (
		activity: ZodType<typeof VolunteerActivityEntitySchema>,
	) => void
	onApply: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
}

export interface VolunteerActivityEditPageProps {
	params: Promise<{ id: string }>
}

export interface VolunteerActivityEditPageClientProps {
	id: string
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
	initialMaxParticipants: number | null
	onCancel: () => void
}

export interface VolunteerActivityPageClientProps {
	initialPage: number
}

export const VOLUNTEER_ACTIVITY_FILTER_OPTIONS = [
	{
		value: Enum.VolunteerActivityStatus.PLANNING,
		label: '계획 중',
		icon: Calendar,
		color: 'bg-blue-500',
		variant: 'secondary' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.RECRUITING,
		label: '모집 중',
		icon: Users,
		color: 'bg-emerald-500',
		variant: 'default' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.SELECTED,
		label: '선발 완료',
		icon: CheckCircle2,
		color: 'bg-purple-500',
		variant: 'secondary' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.IN_PROGRESS,
		label: '진행 중',
		icon: Play,
		color: 'bg-orange-500',
		variant: 'secondary' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.COMPLETED,
		label: '완료',
		icon: CheckCircle,
		color: 'bg-gray-500',
		variant: 'outline' as const,
	},
	{
		value: Enum.VolunteerActivityStatus.CANCELLED,
		label: '취소됨',
		icon: X,
		color: 'bg-red-500',
		variant: 'outline' as const,
	},
	{
		value: 'all',
		label: '전체',
		icon: Calendar,
		color: 'bg-slate-500',
		variant: 'outline' as const,
	},
] as const

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
