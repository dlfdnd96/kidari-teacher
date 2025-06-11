import { noticeSelectors } from './selectors'

export class NoticePage {
	visit() {
		cy.visit('/notice')
		this.waitForPageLoad()
		return this
	}

	waitForPageLoad() {
		cy.get(noticeSelectors.noticeList).should('be.visible')
		return this
	}

	getFirstNoticeCard() {
		return this.getNoticeCards().first()
	}

	getNoticeCards() {
		return cy.get(noticeSelectors.noticeCard)
	}

	getNoticeCount() {
		return this.getNoticeCards().its('length')
	}

	verifyNoticeCreated(title: string, content: string) {
		cy.get(noticeSelectors.noticeCard)
			.first()
			.should('contain.text', title)
			.and('contain.text', content)
		return this
	}
}
