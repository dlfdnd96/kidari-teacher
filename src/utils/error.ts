import { formatISO } from 'date-fns'
import { TIME_ZONE } from '@/constants/date'
import { TZDate } from '@date-fns/tz'

export const ERROR_MESSAGES = {
	NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
	VALIDATION_ERROR: '입력한 정보를 다시 확인해주세요.',
	AUTHENTICATION_ERROR: '로그인이 필요합니다.',
	AUTHORIZATION_ERROR: '접근 권한이 없습니다.',
	NOT_FOUND_ERROR: '요청하신 데이터를 찾을 수 없습니다.',
	CONFLICT_ERROR: '이미 존재하는 데이터입니다.',
	RATE_LIMIT_ERROR: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
	SERVER_ERROR:
		'서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
	UNKNOWN_ERROR:
		'알 수 없는 오류가 발생했습니다. 문제가 지속되면 관리자에게 문의해주세요.',
} as const

export const TRPC_ERROR_MAPPING = {
	BAD_REQUEST: ERROR_MESSAGES.VALIDATION_ERROR,
	UNAUTHORIZED: ERROR_MESSAGES.AUTHENTICATION_ERROR,
	FORBIDDEN: ERROR_MESSAGES.AUTHORIZATION_ERROR,
	NOT_FOUND: ERROR_MESSAGES.NOT_FOUND_ERROR,
	CONFLICT: ERROR_MESSAGES.CONFLICT_ERROR,
	TOO_MANY_REQUESTS: ERROR_MESSAGES.RATE_LIMIT_ERROR,
	INTERNAL_SERVER_ERROR: ERROR_MESSAGES.SERVER_ERROR,
	PARSE_ERROR: ERROR_MESSAGES.VALIDATION_ERROR,
	METHOD_NOT_SUPPORTED: ERROR_MESSAGES.SERVER_ERROR,
	TIMEOUT: ERROR_MESSAGES.NETWORK_ERROR,
	CLIENT_CLOSED_REQUEST: ERROR_MESSAGES.NETWORK_ERROR,
	PRECONDITION_FAILED: ERROR_MESSAGES.VALIDATION_ERROR,
	PAYLOAD_TOO_LARGE: ERROR_MESSAGES.VALIDATION_ERROR,
	UNPROCESSABLE_CONTENT: ERROR_MESSAGES.VALIDATION_ERROR,
} as const

const SENSITIVE_PATTERNS = [
	'password',
	'token',
	'secret',
	'key',
	'credential',
	'database',
	'connection',
	'query',
	'sql',
	'env',
	'config',
	'admin',
	'internal',
	'stack trace',
	'file path',
	'directory',
	'prisma',
	'mongodb',
	'postgres',
	'mysql',
	'redis',
	'unexpected end of json input',
	'syntax error',
	'reference error',
	'type error',
	'cannot read property',
	'cannot read properties',
	'module not found',
	'failed to compile',
]

export function getErrorMessage(error: any): string {
	console.log(error)
	if (
		error?.code &&
		TRPC_ERROR_MAPPING[error.code as keyof typeof TRPC_ERROR_MAPPING]
	) {
		return TRPC_ERROR_MAPPING[error.code as keyof typeof TRPC_ERROR_MAPPING]
	}

	if (
		typeof error === 'string' &&
		Object.keys(ERROR_MESSAGES).includes(error)
	) {
		return ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES]
	}

	return ERROR_MESSAGES.UNKNOWN_ERROR
}

export function logError(error: any, context: string): void {
	const timestamp = formatISO(new TZDate(new Date(), TIME_ZONE.UTC))
	const sanitizedError = {
		message: error?.message || 'Unknown error',
		code: error?.code || 'UNKNOWN',
		stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
		context,
		timestamp,
	}

	const logEntry = JSON.stringify(sanitizedError, (key, value) => {
		if (SENSITIVE_PATTERNS.includes(key.toLowerCase())) {
			return '[REDACTED]'
		}
		return value
	})

	console.error(`[ERROR] ${context}:`, logEntry)
}
