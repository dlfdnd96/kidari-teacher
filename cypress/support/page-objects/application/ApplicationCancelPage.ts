import { MyApplicationPage } from './MyApplicationPage'
import { applicationSelectors } from './selectors'
import {
	APPLICATION_MESSAGES,
	APPLICATION_TIMEOUTS,
} from '../../constants/application'

export class ApplicationCancelPage extends MyApplicationPage {
	verifyCancelConfirmationDialog() {
		cy.contains(APPLICATION_MESSAGES.CANCEL_CONFIRMATION, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	confirmCancel() {
		// 신청 취소 버튼 클릭
		cy.get(applicationSelectors.cancelConfirmDialog)
			.find('button')
			.contains('신청 취소')
			.click()
		return this
	}

	cancelCancel() {
		// 취소 버튼 클릭 (취소 안함)
		cy.get(applicationSelectors.cancelConfirmDialog)
			.find('button')
			.contains('취소')
			.first()
			.click()
		return this
	}

	verifyDialogClosed() {
		cy.get(applicationSelectors.cancelConfirmDialog).should('not.exist')
		return this
	}

	verifyDialogVisible() {
		cy.get(applicationSelectors.cancelConfirmDialog).should('be.visible')
		return this
	}

	waitForCancelComplete() {
		cy.wait(1000)
		return this
	}
}
