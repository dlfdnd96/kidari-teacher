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
	Role: z.enum(['ADMIN', 'USER'], '권한 오류'),
	VolunteerActivityStatus: z.enum(
		[
			'PLANNING',
			'RECRUITING',
			'SELECTED',
			'IN_PROGRESS',
			'COMPLETED',
			'CANCELLED',
		],
		'봉사활동 상태 오류',
	),
	ApplicationStatus: z.enum(
		['WAITING', 'SELECTED', 'REJECTED'],
		'봉사활동 신청 상태 오류',
	),

	ToastPosition: z.enum(
		[
			'top-left',
			'top-center',
			'top-right',
			'bottom-left',
			'bottom-center',
			'bottom-right',
		],
		'토스트 위치 오류',
	),

	TestDataType: z.enum(
		['notices', 'users', 'sessions', 'all', 'test-data'],
		'테스트 데이터 타입 오류',
	),
}
