export const maskString = (str: string, maskChar = '*') => {
	if (str.length <= 2) {
		return str
	}

	const firstChar = str.charAt(0)
	const lastChar = str.charAt(str.length - 1)
	const maskedMiddle = maskChar.repeat(str.length - 2)

	return `${firstChar}${maskedMiddle}${lastChar}`
}
