import { ZodType } from '@/shared/types'
import {
	NoticeFormSchema,
	NoticePickAuthorEntitySchema,
} from '@/shared/schemas/notice'
import { ReactNode } from 'react'

export interface NoticePageProps {
	searchParams: Promise<{ page?: string }>
}

export interface NoticeEditPageProps {
	params: Promise<{ id: string }>
}

export interface NoticePageClientProps {
	initialPage: number
}

export interface PaginationProps {
	currentPage: number
	totalPages: number
	basePath: string
	className?: string
	extraParams?: Record<string, string>
}

export interface NoticeListProps {
	notices: ZodType<typeof NoticePickAuthorEntitySchema>[]
}

export interface NoticeDetailPageProps {
	params: Promise<{ id: string }>
}

export interface NoticeDetailPageClientProps {
	id: string
}

export interface NoticeEditPageClientProps {
	id: string
}

export interface NoticeCardProps {
	notice: ZodType<typeof NoticePickAuthorEntitySchema>
	index?: number
}

export interface NoticeCardHeaderProps {
	title: string
	content?: string
}

export interface NoticeCardMetaProps {
	authorName?: string
	createdAt: Date
}

export interface NoticeEditFormProps {
	id: string
	initialTitle: string
	initialContent: string
	onCancel: () => void
}

export interface NoticeSkeletonListProps {
	count?: number
	showHeader?: boolean
	showPagination?: boolean
}

export interface UseNoticeFormProps {
	onSubmit: (data: ZodType<typeof NoticeFormSchema>) => Promise<void>
	onSuccess: () => void
	notice?: ZodType<typeof NoticePickAuthorEntitySchema>
}

export interface NoticeFormProps {
	onSubmit: (data: ZodType<typeof NoticeFormSchema>) => Promise<void>
	onSuccess: () => void
	onCancel: () => void
	notice?: ZodType<typeof NoticePickAuthorEntitySchema>
}

export interface NoticeFormHeaderProps {
	title: string
	description?: string
}

export interface NoticeFormFieldProps {
	id: string
	label: string
	placeholder: string
	icon: ReactNode
	required?: boolean
	error?: string
	disabled?: boolean
	type?: 'input' | 'textarea'
	rows?: number
	register: any
	dataCy?: string
}

export interface NoticeFormActionsProps {
	loading: boolean
	onCancel: () => void
	isEdit?: boolean
	submitDataCy?: string
	cancelDataCy?: string
}

export interface NoticeEmptyStateProps {
	title?: string
	description?: string
	actionLabel?: string
	onAction?: () => void
}

export interface NoticeSkeletonCardProps {
	index?: number
}

export interface NoticePageLayoutProps {
	children: ReactNode
	showBackButton?: boolean
	onBack?: () => void
	adminActions?: ReactNode
	className?: string
}

export interface NoticeDetailHeaderProps {
	notice: ZodType<typeof NoticePickAuthorEntitySchema>
}

export interface NoticeDetailContentProps {
	content: string
}

export interface NoticeAdminActionsProps {
	onEdit: () => void
	onDelete: () => void
	isAdmin: boolean
}

export interface NoticeDeleteDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isLoading?: boolean
}
