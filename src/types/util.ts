export type ValidationResult = {
	isValid: boolean
	error?: string
}

export type ValidatorFunction = (value: any) => ValidationResult
