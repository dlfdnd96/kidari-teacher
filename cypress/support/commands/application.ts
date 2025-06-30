import {
	ApplicationData,
	VolunteerActivityTestData,
} from '../fixtures/application/applicationTestData'
import { MyApplicationPage, ApplicationCancelPage } from '../page-objects'

// 봉사활동 생성 및 신청을 통해 테스트 데이터 셋업
Cypress.Commands.add(
	'createApplicationViaUI',
	(
		volunteerActivity: VolunteerActivityTestData,
		application: ApplicationData,
	) => {
		// 먼저 봉사활동을 생성
		cy.visit('/volunteer-activities/create')

		// 봉사활동 폼 작성
		cy.get('[data-cy="create-volunteer-activity-title-input"]').type(
			volunteerActivity.title,
		)
		cy.get('[data-cy="create-volunteer-activity-content-input"]').type(
			volunteerActivity.content,
		)
		cy.get('[data-cy="create-volunteer-activity-location-input"]')
			.invoke('val', volunteerActivity.location)
			.trigger('input')
		cy.get('[data-cy="create-volunteer-activity-recruitment-count-input"]')
			.clear()
			.type(volunteerActivity.recruitmentCount.toString())

		// 시작일시 설정
		const startDate = new Date(volunteerActivity.startAt)
		cy.get('[data-cy="create-volunteer-activity-start-date-time-input"]').type(
			startDate.toISOString(),
		)

		// 종료일시 설정
		const endDate = new Date(volunteerActivity.endAt)
		cy.get('[data-cy="create-volunteer-activity-end-date-time-input"]').type(
			endDate.toISOString(),
		)

		// 봉사활동 생성
		cy.get('[data-cy="create-volunteer-activity-button"]').click()

		// 생성된 봉사활동 상세 페이지에서 신청
		cy.get('[data-cy="apply-button"]').click()

		// 신청 모달에서 정보 입력
		cy.get('[data-cy="profession-select"]').click()
		cy.get(`[data-value="${application.profession}"]`).click()

		cy.get('[data-cy="emergency-contact-input"]')
			.clear()
			.type(application.emergencyContact)

		// 신청 완료
		cy.get('[data-cy="submit-application-button"]').click()

		// 모달이 닫힐 때까지 대기
		cy.get('[data-cy="application-modal"]').should('not.exist')
	},
)

// 신청 취소 테스트 헬퍼
Cypress.Commands.add('cancelApplicationViaUI', (activityTitle: string) => {
	const myApplicationPage = new MyApplicationPage()
	const cancelPage = new ApplicationCancelPage()

	myApplicationPage.clickCancelButtonForApplication(activityTitle)

	cancelPage
		.verifyCancelConfirmationDialog()
		.confirmCancel()
		.waitForCancelComplete()

	myApplicationPage.verifyAtListPage().verifyApplicationNotExists(activityTitle)
})

// 신청 취소 시도 후 취소 (실제로 취소하지 않음)
Cypress.Commands.add(
	'attemptCancelApplicationViaUI',
	(activityTitle: string) => {
		const myApplicationPage = new MyApplicationPage()
		const cancelPage = new ApplicationCancelPage()

		myApplicationPage.clickCancelButtonForApplication(activityTitle)

		cancelPage
			.verifyCancelConfirmationDialog()
			.cancelCancel()
			.verifyDialogClosed()

		myApplicationPage.verifyAtListPage().verifyApplicationExists(activityTitle)
	},
)

// 봉사활동 상세 페이지로 이동
Cypress.Commands.add(
	'goToVolunteerActivityDetailByTitle',
	(activityTitle: string) => {
		const myApplicationPage = new MyApplicationPage()

		myApplicationPage
			.clickApplicationByTitle(activityTitle)
			.verifyAtVolunteerActivityDetail()
	},
)

// 신청 내역 테스트 셋업
Cypress.Commands.add('setupApplicationTest', () => {
	cy.login('ADMIN')
	new MyApplicationPage().visit()
})

// 간단한 신청 데이터 생성 (API 호출로)
Cypress.Commands.add('createTestApplicationData', () => {
	// 이미 존재하는 봉사활동에 신청하거나, 테스트용 봉사활동/신청 데이터를 API로 생성
	cy.request('POST', '/api/cypress-cleanup/create-test-application').then(
		(response) => {
			expect(response.status).to.eq(200)
			return response.body
		},
	)
})
