import { ZodType } from '@/shared/types'
import {
	NoticeEntitySchema,
	NoticeListEntitySchema,
} from '@/shared/schemas/notice'

export interface NoticePageProps {
	searchParams: Promise<{ page?: string }>
}

export interface NoticeModalProps {
	open: boolean
	onClose: () => void
}

export interface NoticeCardProps {
	notice: ZodType<typeof NoticeEntitySchema>
	onViewDetail?: (notice: ZodType<typeof NoticeEntitySchema>) => void
}

export interface NoticeDetailModalProps {
	open: boolean
	onClose: () => void
	notice: ZodType<typeof NoticeEntitySchema> | null
}

export interface NoticeEditFormProps {
	id: string
	initialTitle: string
	initialContent: string
	onCancel: () => void
}

export interface NoticeFormProps {
	onSuccess?: () => void
	isModal?: boolean
}

export interface NoticeListProps {
	notices: ZodType<typeof NoticeListEntitySchema>
	onViewDetail?: (notice: ZodType<typeof NoticeEntitySchema>) => void
}

export interface NoticePageClientProps {
	isAdmin: boolean
	initialPage?: number
}

export interface PaginationProps {
	currentPage: number
	totalPages: number
	className?: string
	basePath?: string
}
