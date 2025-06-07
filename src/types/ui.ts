import type {
	FeedbackProps,
	ProfessionGroupProps,
	StatCardProps,
} from '@/types/homepage'

export interface ExtendedFeedbackProps extends FeedbackProps {
	className?: string
}

export interface ExtendedProfessionGroupProps extends ProfessionGroupProps {
	className?: string
}

export interface ExtendedStatCardProps extends StatCardProps {
	className?: string
}
