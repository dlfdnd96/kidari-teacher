import { noticeSelectors } from './selectors'
import { NoticePage } from './NoticePage'
import { NoticeData } from '../../fixtures/notice/noticeTestData'

export class EditNoticePage extends NoticePage {
	verifyAtEditPage() {
		cy.url().should('include', '/edit')
		return this
	}

	verifyFormHasValues(notice: NoticeData) {
		cy.get(noticeSelectors.editTitleInput).should('have.value', notice.title)
		cy.get(noticeSelectors.editContentInput).should(
			'have.value',
			notice.content,
		)
		return this
	}

	clearAndFillForm(notice: NoticeData) {
		cy.get(noticeSelectors.editTitleInput).clear().type(notice.title)
		cy.get(noticeSelectors.editContentInput).clear().type(notice.content)
		return this
	}

	fillTitleAndClearContent(title: string) {
		cy.get(noticeSelectors.editTitleInput).type(title)
		cy.get(noticeSelectors.editContentInput).clear()
		return this
	}

	clickSubmit() {
		cy.get(noticeSelectors.editSubmitButton).click()
		return this
	}

	clickCancel() {
		cy.contains(noticeSelectors.cancelButton).click()
		return this
	}

	verifyStillAtEditPage() {
		cy.url().should('include', '/edit')
		return this
	}

	verifyNotAtEditPage() {
		cy.url().should('not.include', '/edit')
		return this
	}
}
