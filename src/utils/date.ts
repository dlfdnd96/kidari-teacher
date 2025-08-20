export const createDateStringFormat = (date: string) =>
	new Date(date).toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
