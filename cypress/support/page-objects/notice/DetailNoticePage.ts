import { NoticePage } from './NoticePage'
import { noticeSelectors } from './selectors'
import { NOTICE_MESSAGES, NOTICE_TIMEOUTS } from '../../constants'

export class DetailNoticePage extends NoticePage {
	verifyNoticeContent(title: string, content: string) {
		cy.contains(title, { timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE })
		cy.contains(content, { timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE })
		return this
	}

	verifyBackButtonVisible() {
		cy.contains(noticeSelectors.backButtonText, {
			timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE,
		})
		return this
	}

	clickEdit() {
		cy.contains(noticeSelectors.editButtonText, {
			timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE,
		}).click()
		return this
	}

	clickDelete() {
		cy.contains(noticeSelectors.deleteButtonText, {
			timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE,
		}).click()
		return this
	}

	clickBack() {
		cy.contains(noticeSelectors.backButtonText).click()
		return this
	}

	verifyDeleteConfirmationDialog() {
		cy.contains(NOTICE_MESSAGES.DELETE_CONFIRMATION, {
			timeout: NOTICE_TIMEOUTS.ELEMENT_VISIBLE,
		})
		return this
	}

	confirmDelete() {
		cy.get(noticeSelectors.confirmDeleteButton).click()
		return this
	}

	cancelDelete() {
		cy.get(noticeSelectors.cancelDeleteButton).click()
		return this
	}
}
