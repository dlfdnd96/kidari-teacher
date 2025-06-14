import {
	CreateVolunteerActivityInputSchema,
	VolunteerActivityEntitySchema,
} from '@/shared/schemas/volunteer-activity'
import { ZodType } from '@/shared/types'

export interface VolunteerActivitiesPageProps {
	searchParams: Promise<{
		page?: string
		status?: string
		search?: string
	}>
}

export interface VolunteerActivityCardProps {
	activity: ZodType<typeof VolunteerActivityEntitySchema>
	onViewDetail: (
		activity: ZodType<typeof VolunteerActivityEntitySchema>,
	) => void
	onApply?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onEdit?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onDelete?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
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
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
}

export interface VolunteerActivityDetailModalProps {
	activity: ZodType<typeof VolunteerActivityEntitySchema> | null
	open: boolean
	onClose: () => void
	onApply?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	onEdit?: (activity: ZodType<typeof VolunteerActivityEntitySchema>) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
}

export interface VolunteerActivityFormProps {
	activity?: ZodType<typeof VolunteerActivityEntitySchema> | null
	onSubmit: (data: ZodType<typeof CreateVolunteerActivityInputSchema>) => void
	onCancel: () => void
	isLoading?: boolean
	isModal?: boolean
}

export interface VolunteerActivityEditFormProps {
	id: string
	initialTitle: string
	initialDescription: string
	initialStartAt: Date
	initialEndAt: Date
	initialLocation: string
	initialApplicationDeadline: Date
	initialMaxParticipants?: number
	initialQualifications?: string
	initialMaterials?: string
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

export const VOLUNTEER_ACTIVITY_STATUS_LABELS = {
	PLANNING: '일정 계획 중',
	RECRUITING: '신청 접수 중',
	VOTING: '투표 진행 중',
	SELECTED: '선발 완료',
	EDUCATION_APPLYING: '교육 신청 중',
	EDUCATION_CONFIRMED: '교육 확정',
	DOCUMENT_SUBMITTING: '서류 제출 중',
	IN_PROGRESS: '교육 진행 중',
	COMPLETED: '완료',
	CANCELLED: '취소됨',
} as const

export const VOLUNTEER_ACTIVITY_STATUS_COLORS = {
	PLANNING: 'bg-gray-100 text-gray-800',
	RECRUITING: 'bg-blue-100 text-blue-800',
	VOTING: 'bg-yellow-100 text-yellow-800',
	SELECTED: 'bg-green-100 text-green-800',
	EDUCATION_APPLYING: 'bg-purple-100 text-purple-800',
	EDUCATION_CONFIRMED: 'bg-indigo-100 text-indigo-800',
	DOCUMENT_SUBMITTING: 'bg-orange-100 text-orange-800',
	IN_PROGRESS: 'bg-cyan-100 text-cyan-800',
	COMPLETED: 'bg-emerald-100 text-emerald-800',
	CANCELLED: 'bg-red-100 text-red-800',
} as const
