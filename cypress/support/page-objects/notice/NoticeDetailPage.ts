import { NoticePage } from './NoticePage'
import { noticeSelectors } from './selectors'

export class NoticeDetailPage extends NoticePage {
	clickFirstNoticeCard() {
		this.getFirstNoticeCard().should('be.visible').click()
		return this
	}

	waitForDetailModal() {
		cy.get(noticeSelectors.detailModal, { timeout: 10000 }).should('be.visible')
		return this
	}

	verifyDetailModalElements() {
		cy.get(noticeSelectors.detailTitle).should('be.visible').and('not.be.empty')
		cy.get(noticeSelectors.detailContent)
			.should('be.visible')
			.and('not.be.empty')
		cy.get(noticeSelectors.detailAuthor).should('be.visible')
		cy.get(noticeSelectors.detailDate).should('be.visible')
		return this
	}

	closeDetailModal() {
		cy.get(noticeSelectors.detailModal).should('be.visible')

		cy.get(noticeSelectors.detailConfirm).should('exist').click()

		cy.get(noticeSelectors.detailModal).should('not.exist')
		return this
	}
}
