export const APPLICATION_ROUTES = {
	MY_APPLICATIONS: '/my-applications',
} as const

export const APPLICATION_MESSAGES = {
	CANCEL_CONFIRMATION: '신청을 취소하시겠습니까?',
	CANCEL_SUCCESS: '신청이 취소되었습니다.',
	APPLICATION_SUCCESS: '신청이 완료되었습니다.',
	NO_APPLICATIONS: '신청한 봉사활동이 없습니다',
	LOADING: '로딩 중...',
} as const

export const APPLICATION_TIMEOUTS = {
	ELEMENT_VISIBLE: 10000,
	API_RESPONSE: 15000,
	MODAL_ANIMATION: 1000,
	PAGE_LOAD: 10000,
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
