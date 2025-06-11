export interface NoticeData {
	title: string
	content: string
}

export class NoticeTestDataFactory {
	static createTestNotice(): NoticeData {
		const timestamp = Date.now()
		return {
			title: `테스트 공지사항 ${timestamp}`,
			content: `테스트 공지사항 내용입니다. ${timestamp}`,
		}
	}

	static createUpdatedTestNotice(): NoticeData {
		const timestamp = Date.now()
		return {
			title: `수정된 테스트 공지사항 ${timestamp}`,
			content: `수정된 테스트 공지사항 내용입니다. ${timestamp}`,
		}
	}
}
