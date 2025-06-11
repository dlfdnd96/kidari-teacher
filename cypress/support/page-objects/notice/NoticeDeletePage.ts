import { noticeSelectors } from './selectors'
import { NoticePage } from './NoticePage'

export class NoticeDeletePage extends NoticePage {
	clickDeleteButton() {
		cy.get(noticeSelectors.noticeCard)
			.first()
			.find(noticeSelectors.deleteButton)
			.should('be.visible')
			.click()
		return this
	}

	confirmDelete() {
		cy.get(noticeSelectors.deleteConfirmButton).should('be.visible').click()
		cy.get(noticeSelectors.deleteConfirmButton).should('not.exist')
		return this
	}

	verifyNoticeDeleted(title: string) {
		cy.get(noticeSelectors.noticeCard).first().should('not.contain.text', title)
		return this
	}
}
