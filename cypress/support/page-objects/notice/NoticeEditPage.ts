import { noticeSelectors } from './selectors'
import { NoticePage } from './NoticePage'

export class NoticeEditPage extends NoticePage {
	clickEditButton() {
		cy.get(noticeSelectors.noticeCard)
			.first()
			.find(noticeSelectors.editButton)
			.should('be.visible')
			.click()
		return this
	}

	waitForEditForm() {
		cy.get(noticeSelectors.editForm, { timeout: 10000 }).should('be.visible')
		return this
	}

	fillEditForm(title: string, content: string) {
		cy.get(noticeSelectors.editTitleInput)
			.should('be.visible')
			.clear()
			.type(title)
		cy.get(noticeSelectors.editContentInput)
			.should('be.visible')
			.clear()
			.type(content)
		return this
	}

	submitEditForm() {
		cy.get(noticeSelectors.editSubmitButton).should('be.visible').click()
		cy.get(noticeSelectors.editForm).should('not.exist')
		return this
	}

	verifyNoticeUpdated(title: string, content: string) {
		cy.get(noticeSelectors.noticeCard)
			.first()
			.should('contain.text', title)
			.and('contain.text', content)
		return this
	}
}
