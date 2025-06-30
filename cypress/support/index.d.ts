declare namespace Cypress {
	interface Chainable {
		login(role: string): Chainable<void>
		cleanupTestData(dataType: string): Chainable<void>
		interceptAPI(
			method: string,
			url: string,
			alias: string,
			response?: any,
		): Chainable<void>
		waitForLoading(selector?: string): Chainable<void>
		checkToast(
			message: string,
			type?: 'success' | 'error' | 'warning' | 'info',
		): Chainable<void>
		checkAccessibility(): Chainable<void>
		setViewport(device: 'mobile' | 'tablet' | 'desktop'): Chainable<void>
		clearBrowserData(): Chainable<void>
		uploadFile(
			selector: string,
			fileName: string,
			fileType?: string,
		): Chainable<void>

		// 공지사항 관련 커맨드
		createNoticeViaUI(notice: NoticeData): Chainable<void>
		editNoticeViaUI(
			originalNotice: NoticeData,
			updatedNotice: NoticeData,
		): Chainable<void>
		deleteNoticeViaUI(notice: NoticeData): Chainable<void>
		goToNoticeDetailByTitle(title: string): Chainable<void>
		setupNoticeTest(): Chainable<void>

		// 신청 내역 관련 커맨드
		createApplicationViaUI(
			volunteerActivity: VolunteerActivityTestData,
			application: ApplicationData,
		): Chainable<void>
		cancelApplicationViaUI(activityTitle: string): Chainable<void>
		attemptCancelApplicationViaUI(activityTitle: string): Chainable<void>
		goToVolunteerActivityDetailByTitle(activityTitle: string): Chainable<void>
		setupApplicationTest(): Chainable<void>
		createTestApplicationData(): Chainable<any>
	}
}
