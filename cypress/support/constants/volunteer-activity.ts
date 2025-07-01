export const VOLUNTEER_ACTIVITY_ROUTES = {
	LIST: '/volunteer-activities',
	CREATE: '/volunteer-activities/create',
} as const

export const VOLUNTEER_ACTIVITY_MESSAGES = {
	DELETE_CONFIRMATION: '봉사활동을 삭제하시겠습니까?',
} as const

export const VOLUNTEER_ACTIVITY_TIMEOUTS = {
	PAGE_LOAD: 10000,
	ELEMENT_VISIBLE: 5000,
} as const
