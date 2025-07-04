import { ZodType } from '@/shared/types'
import { NoticePickAuthorEntitySchema } from '@/shared/schemas/notice'

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
	noticeId: string
}

export interface NoticeEditPageClientProps {
	noticeId: string
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
	initialTitle?: string
	initialContent?: string
	onSuccess?: () => void
	onSubmit: (data: { title: string; content: string }) => Promise<void>
}
