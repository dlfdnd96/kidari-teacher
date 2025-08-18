import { ZodType } from '@/shared/types'
import { ActivityRecordSchema } from '@/shared/schemas/landing'

export interface ActivityStatisticsProps {
	activityData: ZodType<typeof ActivityRecordSchema> | null
}

export interface RecentActivitiesTableProps {
	activityData: ZodType<typeof ActivityRecordSchema> | null
}

export interface ProfessionTag {
	id: string
	label: string
	variant: 'primary' | 'secondary'
	size: 'sm' | 'lg' | 'xl'
}

export interface MenuItem {
	id: string
	label: string
	href: string
}

export interface SchoolLogo {
	src: string
	alt: string
	width: number
	height: number
}

export interface TestimonialItem {
	id: string
	quote: string
}
