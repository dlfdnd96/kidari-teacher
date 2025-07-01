export interface VolunteerActivityTestData {
	title: string
	description: string
	location: string
	startDate: string
	startTime: string
	endDate: string
	endTime: string
	applicationDeadline: string
	maxParticipants: string
}

export class VolunteerActivityTestDataFactory {
	static createTestVolunteerActivity(): VolunteerActivityTestData {
		const timestamp = Date.now()
		const now = new Date()
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7일 후
		const farFutureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14일 후
		const applicationDeadlineDate = new Date(
			now.getTime() + 3 * 24 * 60 * 60 * 1000,
		) // 3일 후

		return {
			title: `테스트 봉사활동 ${timestamp}`,
			description: `테스트 봉사활동 설명입니다. ${timestamp}`,
			location: `테스트 장소 ${timestamp}`,
			startDate: futureDate.toISOString().split('T')[0],
			startTime: '09:00',
			endDate: farFutureDate.toISOString().split('T')[0],
			endTime: '17:00',
			applicationDeadline: applicationDeadlineDate.toISOString().split('T')[0],
			maxParticipants: '10',
		}
	}

	static createUpdatedTestVolunteerActivity(): VolunteerActivityTestData {
		const timestamp = Date.now()
		const now = new Date()
		const futureDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) // 10일 후
		const farFutureDate = new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000) // 17일 후
		const applicationDeadlineDate = new Date(
			now.getTime() + 5 * 24 * 60 * 60 * 1000,
		) // 5일 후

		return {
			title: `수정된 테스트 봉사활동 ${timestamp}`,
			description: `수정된 테스트 봉사활동 설명입니다. ${timestamp}`,
			location: `수정된 테스트 장소 ${timestamp}`,
			startDate: futureDate.toISOString().split('T')[0],
			startTime: '10:00',
			endDate: farFutureDate.toISOString().split('T')[0],
			endTime: '18:00',
			applicationDeadline: applicationDeadlineDate.toISOString().split('T')[0],
			maxParticipants: '15',
		}
	}
}
