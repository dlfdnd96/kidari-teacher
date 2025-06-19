import { z } from 'zod/v4-mini'

export const Enum = {
	Role: z.enum(['ADMIN', 'USER']).def.entries,
	VolunteerActivityStatus: z.enum([
		'PLANNING',
		'RECRUITING',
		'SELECTED',
		'IN_PROGRESS',
		'COMPLETED',
		'CANCELLED',
	]).def.entries,
	ApplicationStatus: z.enum(['WAITING', 'SELECTED', 'REJECTED']).def.entries,

	ToastPosition: z.enum([
		'top-left',
		'top-center',
		'top-right',
		'bottom-left',
		'bottom-center',
		'bottom-right',
	]).def.entries,

	TestDataType: z.enum(['notices', 'users', 'sessions', 'all', 'test-data']).def
		.entries,
}

export const ZodEnum = {
	Role: z.enum(['ADMIN', 'USER']),
	VolunteerActivityStatus: z.enum([
		'PLANNING',
		'RECRUITING',
		'SELECTED',
		'IN_PROGRESS',
		'COMPLETED',
		'CANCELLED',
	]),
	ApplicationStatus: z.enum(['WAITING', 'SELECTED', 'REJECTED']),

	ToastPosition: z.enum([
		'top-left',
		'top-center',
		'top-right',
		'bottom-left',
		'bottom-center',
		'bottom-right',
	]),

	TestDataType: z.enum(['notices', 'users', 'sessions', 'all', 'test-data']),
}
