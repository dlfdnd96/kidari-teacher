import { noticeSelectors } from './selectors'
import { NoticePage } from './NoticePage'

export class NoticeCreatePage extends NoticePage {
	clickCreateButton() {
		cy.get(noticeSelectors.createButton).should('be.visible').click()
		return this
	}

	waitForCreateModal() {
		cy.get(noticeSelectors.createModal, { timeout: 10000 }).should('be.visible')
		return this
	}

	fillCreateForm(title: string, content: string) {
		cy.get(noticeSelectors.createModal).within(() => {
			cy.get(noticeSelectors.createTitleInput)
				.should('be.visible')
				.clear()
				.type(title)
			cy.get(noticeSelectors.createContentInput)
				.should('be.visible')
				.clear()
				.type(content)
		})
		return this
	}

	fillTitle(title: string) {
		cy.get(noticeSelectors.createTitleInput)
			.should('be.visible')
			.clear()
			.type(title)
		return this
	}

	submitCreateForm() {
		this.clickSubmitButton()
		cy.get(noticeSelectors.createModal).should('not.exist')
		return this
	}

	clickSubmitButton() {
		cy.get(noticeSelectors.createSubmitButton).should('be.visible').click()
		return this
	}

	formVisible() {
		cy.get(noticeSelectors.createModal).should('be.visible')
		return this
	}
}
