import { ZodType } from '@/shared/types'
import {
	NoticeFormSchema,
	NoticePickAuthorEntitySchema,
} from '@/shared/schemas/notice'

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
