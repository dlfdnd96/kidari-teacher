import { useCallback, useState } from 'react'
import { ValidatorFunction } from '@/types/util'
import {
	FormData,
	FieldErrors,
	UseFieldValidationReturn,
	ValidationRules,
} from '@/types/hook'

export const useFieldValidation = (): UseFieldValidationReturn => {
	const [errors, setErrors] = useState<FieldErrors>({})

	const validateField = useCallback(
		(fieldName: string, value: any, validator: ValidatorFunction): boolean => {
			const result = validator(value)

			setErrors((prev) => ({
				...prev,
				[fieldName]: result.error || '',
			}))

			return result.isValid
		},
		[],
	)

	const clearError = useCallback((fieldName: string) => {
		setErrors((prev) => {
			const newErrors = { ...prev }
			delete newErrors[fieldName]
			return newErrors
		})
	}, [])

	const clearAllErrors = useCallback(() => {
		setErrors({})
	}, [])

	const validateAll = useCallback(
		(data: FormData, rules: ValidationRules): boolean => {
			const newErrors: FieldErrors = {}
			let hasValidationErrors = false

			Object.entries(rules).forEach(([fieldName, validator]) => {
				const value = data[fieldName]
				const result = validator(value)

				if (!result.isValid) {
					newErrors[fieldName] = result.error || '유효하지 않은 값입니다.'
					hasValidationErrors = true
				}
			})

			setErrors(newErrors)

			return hasValidationErrors
		},
		[],
	)

	const hasErrors =
		Object.keys(errors).length > 0 &&
		Object.values(errors).some((error) => error)

	return {
		errors,
		validateField,
		clearError,
		clearAllErrors,
		validateAll,
		hasErrors,
	}
}

export const useRealTimeValidation = (
	fieldName: string,
	validator: ValidatorFunction,
	validationHook: UseFieldValidationReturn,
) => {
	const { validateField, clearError } = validationHook

	const validateOnChange = useCallback(
		(value: any) => {
			if (value === '' || value === null || value === undefined) {
				clearError(fieldName)
			} else {
				validateField(fieldName, value, validator)
			}
		},
		[fieldName, validator, validateField, clearError],
	)

	const clearErrorIfValid = useCallback(
		(value: any) => {
			const result = validator(value)
			if (result.isValid) {
				clearError(fieldName)
			}
		},
		[fieldName, validator, clearError],
	)

	return {
		validateOnChange,
		clearErrorIfValid,
	}
}
