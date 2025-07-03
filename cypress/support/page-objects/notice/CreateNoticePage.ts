import { noticeSelectors } from './selectors'
import { NoticePage } from './NoticePage'
import { NoticeData } from '../../fixtures/notice/noticeTestData'
import { NOTICE_ROUTES } from '../../constants'

export class CreateNoticePage extends NoticePage {
	verifyAtCreatePage() {
		cy.url().should('include', NOTICE_ROUTES.CREATE)
		return this
	}

	verifyFormVisible() {
		cy.get(noticeSelectors.createForm).should('be.visible')
		return this
	}

	fillNoticeForm(notice: NoticeData) {
		cy.get(noticeSelectors.createTitleInput).type(notice.title)
		cy.get(noticeSelectors.createContentInput).type(notice.content)
		return this
	}

	fillTitleOnly(title: string) {
		cy.get(noticeSelectors.createTitleInput).type(title)
		return this
	}

	clickSubmit() {
		cy.get(noticeSelectors.createSubmitButton).click()
		return this
	}

	clickCancel() {
		cy.contains(noticeSelectors.cancelButton).click()
		return this
	}

	verifyStillAtCreatePage() {
		cy.url().should('include', NOTICE_ROUTES.CREATE)
		return this
	}
}
