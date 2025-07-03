export const NOTICE_ROUTES = {
	LIST: '/notice',
	CREATE: '/notice/create',
} as const

export const NOTICE_MESSAGES = {
	DELETE_CONFIRMATION: '공지사항을 삭제하시겠습니까?',
} as const

export const NOTICE_TIMEOUTS = {
	PAGE_LOAD: 10000,
	ELEMENT_VISIBLE: 5000,
} as const
