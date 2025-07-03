import { MyApplicationPage } from './MyApplicationPage'
import { applicationSelectors } from './selectors'
import { APPLICATION_MESSAGES, APPLICATION_TIMEOUTS } from '../../constants'

export class ApplicationCancelPage extends MyApplicationPage {
	verifyCancelConfirmationDialog() {
		cy.contains(APPLICATION_MESSAGES.CANCEL_CONFIRMATION, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	confirmCancel() {
		cy.get(applicationSelectors.confirmCancelButton).click()
		return this
	}

	cancelCancel() {
		cy.get(applicationSelectors.cancelCancelButton).click()
		return this
	}

	verifyDialogClosed() {
		cy.get(applicationSelectors.cancelConfirmDialog).should('not.exist')
		return this
	}

	waitForCancelComplete() {
		cy.wait(1000)
		return this
	}
}
