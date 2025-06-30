export const APPLICATION_ROUTES = {
	MY_APPLICATIONS: '/my-applications',
	VOLUNTEER_ACTIVITIES: '/volunteer-activities',
} as const

export const APPLICATION_MESSAGES = {
	CANCEL_CONFIRMATION: '봉사활동 신청을 취소하시겠습니까?',
	NO_APPLICATIONS: '신청한 봉사활동이 없습니다',
	LOADING: '로딩 중...',
} as const

export const APPLICATION_TIMEOUTS = {
	PAGE_LOAD: 10000,
	ELEMENT_VISIBLE: 5000,
	NETWORK_REQUEST: 15000,
} as const

export const APPLICATION_STATUS = {
	WAITING: 'WAITING',
	SELECTED: 'SELECTED',
	REJECTED: 'REJECTED',
} as const

export const APPLICATION_STATUS_LABELS = {
	WAITING: '대기중',
	SELECTED: '승인됨',
	REJECTED: '거절됨',
} as const
