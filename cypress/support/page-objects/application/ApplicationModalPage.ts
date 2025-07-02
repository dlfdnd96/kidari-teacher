import { applicationSelectors } from './selectors'
import { ApplicationData } from '../../fixtures/application/applicationTestData'
import { APPLICATION_TIMEOUTS } from '../../constants'

export class ApplicationModalPage {
	clickApplyButton() {
		cy.get(applicationSelectors.applyButton).click()
		return this
	}

	verifyApplicationModalVisible() {
		cy.get(applicationSelectors.applicationModal, {
			timeout: APPLICATION_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	selectProfession(profession: string) {
		cy.get(applicationSelectors.userProfileProfessionSelector).should(
			'be.visible',
		)
		cy.get(applicationSelectors.userProfileProfessionSelectBox).click()
		cy.get(
			`[data-cy="application-form-user-profile-profession-${profession}"]`,
		).click()
		return this
	}

	fillEmergencyContact(emergencyContact: string) {
		cy.get(applicationSelectors.emergencyContactInput)
			.clear()
			.type(emergencyContact)
		return this
	}

	fillApplicationForm(application: ApplicationData) {
		this.selectProfession(application.profession)
		this.fillEmergencyContact(application.emergencyContact)
		return this
	}

	submitApplication() {
		cy.get(applicationSelectors.submitApplicationButton).click()
		return this
	}

	waitForModalToClose() {
		cy.get(applicationSelectors.applicationModal, {
			timeout: APPLICATION_TIMEOUTS.MODAL_ANIMATION,
		}).should('not.exist')
		return this
	}

	completeApplicationProcess(application: ApplicationData) {
		this.clickApplyButton()
			.verifyApplicationModalVisible()
			.fillApplicationForm(application)
			.submitApplication()
			.waitForModalToClose()
		return this
	}
}
