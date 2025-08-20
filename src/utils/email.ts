export const sanitizeEmail = (email: string): string => {
	return email.trim()
}

export const handleEmailContact = (email: string): void => {
	const subject = '키다리 선생님 봉사활동 문의'
	window.location.href = `mailto:${sanitizeEmail(email)}?subject=${encodeURIComponent(subject)}`
}
