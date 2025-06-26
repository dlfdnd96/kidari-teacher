import { ZodType } from '@/shared/types'
import { NoticePickAuthorEntitySchema } from '@/shared/schemas/notice'

export interface NoticePageProps {
	searchParams: Promise<{ page?: string }>
}

export interface NoticePageClientProps {
	isAdmin: boolean
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

export interface NoticeTableProps {
	notices: ZodType<typeof NoticePickAuthorEntitySchema>[]
}

export interface NoticeDetailPageProps {
	params: Promise<{ id: string }>
}

export interface NoticeDetailPageClientProps {
	noticeId: string
	isAdmin: boolean
}

export interface NoticeEditPageClientProps {
	noticeId: string
}

export interface NoticeModalProps {
	open: boolean
	onClose: () => void
}

export interface NoticeCardProps {
	notice: ZodType<typeof NoticePickAuthorEntitySchema>
	onViewDetail?: (notice: ZodType<typeof NoticePickAuthorEntitySchema>) => void
}

export interface NoticeDetailModalProps {
	open: boolean
	onClose: () => void
	notice: ZodType<typeof NoticePickAuthorEntitySchema> | null
}

export interface NoticeEditFormProps {
	id: string
	initialTitle: string
	initialContent: string
	onCancel: () => void
}
