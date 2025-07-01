export const PROFILE_ROUTES = {
	MAIN: '/profile',
	SETUP: '/profile/setup',
	CHECK: '/profile/check',
} as const

export const PROFILE_TIMEOUTS = {
	PAGE_LOAD: 10000,
	ELEMENT_VISIBLE: 5000,
	FORM_SUBMIT: 8000,
} as const
