export interface ApplicationData {
	profession: string
	emergencyContact: string
	volunteerActivityId: string
	volunteerActivityTitle: string
}

export interface VolunteerActivityTestData {
	title: string
	content: string
	location: string
	startAt: string
	endAt: string
	recruitmentCount: number
}

export class ApplicationTestDataFactory {
	static createTestApplication(): ApplicationData {
		const timestamp = Date.now()
		return {
			profession: 'TEACHER',
			emergencyContact: '01012345678',
			volunteerActivityId: '',
			volunteerActivityTitle: `테스트 봉사활동 ${timestamp}`,
		}
	}

	static createVolunteerActivityTestData(): VolunteerActivityTestData {
		const timestamp = Date.now()
		const now = new Date()
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7일 후
		const endDate = new Date(futureDate.getTime() + 2 * 60 * 60 * 1000) // 시작 후 2시간

		return {
			title: `테스트 봉사활동 ${timestamp}`,
			content: `테스트 봉사활동 내용입니다. ${timestamp}`,
			location: `테스트 장소 ${timestamp}`,
			startAt: futureDate.toISOString(),
			endAt: endDate.toISOString(),
			recruitmentCount: 5,
		}
	}

	static createPastVolunteerActivityTestData(): VolunteerActivityTestData {
		const timestamp = Date.now()
		const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7일 전
		const pastEndDate = new Date(pastDate.getTime() + 2 * 60 * 60 * 1000) // 시작 후 2시간

		return {
			title: `과거 테스트 봉사활동 ${timestamp}`,
			content: `과거 테스트 봉사활동 내용입니다. ${timestamp}`,
			location: `과거 테스트 장소 ${timestamp}`,
			startAt: pastDate.toISOString(),
			endAt: pastEndDate.toISOString(),
			recruitmentCount: 3,
		}
	}
}
