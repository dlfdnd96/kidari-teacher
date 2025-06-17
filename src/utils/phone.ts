/**
 * 숫자만 입력받아서 000-0000-0000 형태로 포맷팅
 * @param value 입력된 전화번호 (숫자 또는 포맷된 형태)
 * @returns 포맷된 전화번호 문자열
 */
export const formatPhoneNumber = (value: string): string => {
	const numbers = value.replace(/\D/g, '')
	const truncated = numbers.slice(0, 11)

	if (truncated.length <= 3) {
		return truncated
	} else if (truncated.length <= 7) {
		return `${truncated.slice(0, 3)}-${truncated.slice(3)}`
	} else {
		return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`
	}
}

/**
 * 포맷된 전화번호에서 대시를 제거하여 숫자만 반환
 * @param formattedPhone 포맷된 전화번호
 * @returns 숫자만 있는 전화번호
 */
export const removePhoneNumberFormat = (formattedPhone: string): string => {
	return formattedPhone.replace(/\D/g, '')
}

/**
 * 전화번호가 유효한 형식인지 검증
 * @param phone 전화번호 (숫자만)
 * @returns 유효한지 여부
 */
export const isValidPhoneNumber = (phone: string): boolean => {
	const numbers = phone.replace(/\D/g, '')
	// 한국 휴대폰 번호는 11자리 (010-0000-0000)
	// 일반 전화번호는 9-11자리 가능
	return numbers.length >= 9 && numbers.length <= 11
}
