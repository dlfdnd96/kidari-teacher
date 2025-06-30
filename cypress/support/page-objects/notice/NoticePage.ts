import { noticeSelectors } from './selectors'
import { NOTICE_ROUTES, NOTICE_TIMEOUTS } from '../../constants/notice'

export class NoticePage {
	private baseUrl = NOTICE_ROUTES.LIST

	visit() {
		cy.visit(NOTICE_ROUTES.LIST, { timeout: NOTICE_TIMEOUTS.PAGE_LOAD })
		this.waitForPageLoad()
		return this
	}

	waitForPageLoad() {
		cy.get(noticeSelectors.createButton, {
			timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	clickCreateButton() {
		cy.get(noticeSelectors.createButton).should('be.visible').click()
		return this
	}

	getNoticeCards() {
		return cy.get(noticeSelectors.noticeCard)
	}

	verifyNoticeExists(title: string) {
		cy.contains(title, { timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE })
		return this
	}

	verifyNoticeNotExists(title: string) {
		cy.contains(title).should('not.exist')
		return this
	}

	clickNoticeByTitle(title: string) {
		cy.contains(title).click()
		return this
	}

	clickFirstNotice() {
		this.getNoticeCards().first().click()
		return this
	}

	verifyAtListPage() {
		cy.url().should('eq', Cypress.config().baseUrl + this.baseUrl)
		return this
	}

	verifyAtDetailPage() {
		cy.url().should('include', this.baseUrl + '/')
		cy.url().should('not.eq', Cypress.config().baseUrl + this.baseUrl)
		return this
	}

	verifyMinimumNoticeCount(count: number) {
		this.getNoticeCards().should('have.length.at.least', count)
		return this
	}
}
