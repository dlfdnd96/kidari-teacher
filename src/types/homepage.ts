export interface StatCardProps {
	icon: string
	value: string
	label: string
	description?: string
	gradient: string
	borderColor: string
	hoverColor?: string
}

export interface ProfessionGroupProps {
	icon: string
	title: string
	description: string
	gradient: string
}

export interface FeedbackProps {
	content: string
	borderColor: string
	quoteColor: string
	bgGradient: string
}

export interface ActivityRecordProps {
	date: string
	school: string
	location: string
}

export interface TimeSlotProps {
	time: string
	type: 'primary' | 'secondary'
	color: string
	borderColor: string
}

export interface ImpactStatProps {
	icon: string
	value: string
	label: string
	description: string
	gradient: string
}

export interface ContactMethodProps {
	icon: string
	label: string
	value: string
	type: 'phone' | 'email' | 'kakao'
	href?: string
}

export interface ProcessStepProps {
	step: number
	title: string
	description: string
	danger?: {
		attention: string
		title: string
		items?: string[]
	}
	warning?: {
		attention: string
		title: string
		items?: string[]
	}
	note?: {
		title: string
		items: string[]
	}
	gradient: string
}

export interface PhotoGalleryItemProps {
	src: string
	alt: string
	title: string
	description: string
	aspectRatio: string
	isMain?: boolean
}
