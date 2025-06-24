import { ValidatorFunction } from '@/types/util'

export type FieldErrors = Record<string, string>
export type ValidationRules = Record<string, ValidatorFunction>
export type FormData = Record<string, any>

export interface UseFieldValidationReturn {
	errors: FieldErrors
	validateField: (
		fieldName: string,
		value: any,
		validator: ValidatorFunction,
	) => boolean
	clearError: (fieldName: string) => void
	clearAllErrors: () => void
	validateAll: (data: FormData, rules: ValidationRules) => boolean
	hasErrors: boolean
}
