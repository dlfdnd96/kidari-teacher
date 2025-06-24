import { ValidationResult, ValidatorFunction } from '@/types/util'
import { z } from 'zod/v4-mini'
import { PHONE_PATTERN } from '@/constants/validation'

export const validators = {
	required: (message: string = '필수 입력 항목입니다.'): ValidatorFunction => {
		return (value: any) => {
			const isEmpty =
				value === null ||
				value === undefined ||
				(typeof value === 'string' && !value.trim()) ||
				(Array.isArray(value) && value.length === 0)

			return {
				isValid: !isEmpty,
				error: isEmpty ? message : undefined,
			}
		}
	},
	minLength: (min: number, message?: string): ValidatorFunction => {
		return (value: string) => {
			const trimmedValue = value?.trim() || ''
			const isValid = trimmedValue.length >= min
			return {
				isValid,
				error: isValid
					? undefined
					: message || `최소 ${min}자 이상 입력해주세요.`,
			}
		}
	},
	maxLength: (max: number, message?: string): ValidatorFunction => {
		return (value: string) => {
			const trimmedValue = value?.trim() || ''
			const isValid = trimmedValue.length <= max
			return {
				isValid,
				error: isValid
					? undefined
					: message || `최대 ${max}자 이하로 입력해주세요.`,
			}
		}
	},
	numberRange: (min?: number, max?: number): ValidatorFunction => {
		return (value: number) => {
			if (min !== undefined && value < min) {
				return { isValid: false, error: `${min} 이상의 값을 입력해주세요.` }
			} else if (max !== undefined && value > max) {
				return { isValid: false, error: `${max} 이하의 값을 입력해주세요.` }
			}

			return { isValid: true }
		}
	},
	pattern: (regex: RegExp, message: string): ValidatorFunction => {
		return (value: string) => {
			const isValid = regex.test(value)
			return {
				isValid,
				error: isValid ? undefined : message,
			}
		}
	},
	arrayMinLength: (min: number, message?: string): ValidatorFunction => {
		return (value: any[]) => {
			const isValid = Array.isArray(value) && value.length >= min
			return {
				isValid,
				error: isValid
					? undefined
					: message || `최소 ${min}개 이상 선택해주세요.`,
			}
		}
	},

	// 직접 검증
	name: (value: unknown): ValidationResult => {
		if (typeof value !== 'string') {
			return { isValid: false, error: '이름은 문자열이어야 합니다.' }
		} else if (!value || !value.trim()) {
			return { isValid: false, error: '이름을 입력해주세요.' }
		} else if (value.trim().length < 2) {
			return { isValid: false, error: '이름은 2자 이상 입력해주세요.' }
		} else if (value.trim().length > 20) {
			return { isValid: false, error: '이름은 20자 이하로 입력해주세요.' }
		}

		return { isValid: true }
	},
	phone: (value: unknown): ValidationResult => {
		if (typeof value !== 'string') {
			return { isValid: false, error: '연락처는 문자열이어야 합니다.' }
		} else if (!value || !value.trim()) {
			return { isValid: false, error: '연락처를 입력해주세요.' }
		} else if (!PHONE_PATTERN.test(value)) {
			return {
				isValid: false,
				error: '올바른 연락처를 입력해주세요.',
			}
		}

		return { isValid: true }
	},
	email: (value: unknown): ValidationResult => {
		if (typeof value !== 'string') {
			return { isValid: false, error: '이메일은 문자열이어야 합니다.' }
		} else if (!value || !value.trim()) {
			return { isValid: false, error: '이메일을 입력해주세요.' }
		} else if (z.email().safeParse(value).error) {
			return { isValid: false, error: '올바른 이메일 형식을 입력해주세요.' }
		}

		return { isValid: true }
	},
}

export const combineValidators = (...validatorFuncs: ValidatorFunction[]) => {
	return (value: any): ValidationResult => {
		for (const validator of validatorFuncs) {
			const result = validator(value)
			if (!result.isValid) {
				return result
			}
		}
		return { isValid: true }
	}
}

export const commonValidators = {
	requiredName: (value: unknown) =>
		combineValidators(validators.required(), () => validators.name(value)),
	requiredPhone: (value: unknown) =>
		combineValidators(validators.required('연락처를 입력해주세요.'), () =>
			validators.phone(value),
		),
	requiredEmail: (value: unknown) =>
		combineValidators(validators.required('이메일을 입력해주세요.'), () =>
			validators.email(value),
		),
	requiredProfessions: validators.arrayMinLength(
		1,
		'최소 1개 이상의 직업을 선택해주세요.',
	),
}
