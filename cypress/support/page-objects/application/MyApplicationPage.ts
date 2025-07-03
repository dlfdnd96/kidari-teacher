import {
	APPLICATION_MESSAGES,
	APPLICATION_ROUTES,
	APPLICATION_TIMEOUTS,
	VOLUNTEER_ACTIVITY_ROUTES,
} from '../../constants'

export class MyApplicationPage {
	private baseUrl = APPLICATION_ROUTES.MY_APPLICATIONS

	visit() {
		cy.visit(APPLICATION_ROUTES.MY_APPLICATIONS, {
			timeout: APPLICATION_TIMEOUTS.PAGE_LOAD,
		})
		this.waitForPageLoad()
		return this
	}

	waitForPageLoad() {
		cy.get('body', { timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE }).should(
			'be.visible',
		)
		return this
	}

	getApplicationRows() {
		return cy
			.get('table tbody tr')
			.not(':contains("신청한 봉사활동이 없습니다")')
	}

	verifyApplicationExists(activityTitle: string) {
		cy.contains(activityTitle, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyApplicationNotExists(activityTitle: string) {
		cy.contains(activityTitle).should('not.exist')
		return this
	}

	clickApplicationByTitle(activityTitle: string) {
		cy.contains(activityTitle).click()
		return this
	}

	clickFirstApplication() {
		this.getApplicationRows()
			.first()
			.find('[data-cy="application-title"] div.cursor-pointer')
			.click()
		return this
	}

	verifyAtListPage() {
		cy.url().should('include', this.baseUrl)
		return this
	}

	verifyAtVolunteerActivityDetail() {
		cy.url().should('include', `${VOLUNTEER_ACTIVITY_ROUTES.LIST}/`)
		return this
	}

	verifyMinimumApplicationCount(count: number) {
		this.getApplicationRows().should('have.length.at.least', count)
		return this
	}

	verifyEmptyState() {
		cy.contains(APPLICATION_MESSAGES.NO_APPLICATIONS, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyTotalCount(count: number) {
		cy.contains(`총 ${count}개`, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	getCancelButtonForApplication(activityTitle: string) {
		return cy.contains('tr', activityTitle).find('button:contains("취소")')
	}

	clickCancelButtonForApplication(activityTitle: string) {
		this.getCancelButtonForApplication(activityTitle).click()
		return this
	}

	verifyApplicationStatus(activityTitle: string, status: string) {
		cy.contains('tr', activityTitle)
			.find('td:first-child')
			.should('contain', status)
		return this
	}

	verifyCancelButtonVisible(activityTitle: string) {
		this.getCancelButtonForApplication(activityTitle).should('be.visible')
		return this
	}

	verifyCancelButtonNotVisible(activityTitle: string) {
		cy.contains('tr', activityTitle)
			.find('button:contains("취소")')
			.should('not.exist')
		return this
	}

	verifyErrorState() {
		cy.contains('신청 내역을 불러올 수 없습니다', {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyRetryButtonVisible() {
		cy.contains('다시 시도', {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	clickRetryButton() {
		cy.contains('다시 시도').click()
		return this
	}

	checkAccessibility() {
		cy.checkAccessibility()
		return this
	}
}
