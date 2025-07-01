import { profileSelectors } from './selectors'
import { PROFILE_ROUTES, PROFILE_TIMEOUTS } from '../../constants/profile'
import { SetupProfileData } from '../../fixtures/profile/profileTestData'
import { formatPhoneNumber } from '../utils'

export class SetupPage {
	visit() {
		cy.visit(PROFILE_ROUTES.SETUP)
		cy.get(profileSelectors.setupPage, {
			timeout: PROFILE_TIMEOUTS.PAGE_LOAD,
		}).should('be.visible')
		return this
	}

	verifyAtSetupPage() {
		cy.url().should('include', PROFILE_ROUTES.SETUP)
		cy.get(profileSelectors.setupPage).should('be.visible')
		return this
	}

	verifyFormVisible() {
		cy.get(profileSelectors.setupNameInput).should('be.visible')
		cy.get(profileSelectors.setupPhoneInput).should('be.visible')
		cy.get(profileSelectors.setupSubmitButton).should('be.visible')
		return this
	}

	fillSetupForm(profile: SetupProfileData) {
		cy.get(profileSelectors.setupNameInput).clear().type(profile.name)

		const formattedPhone = formatPhoneNumber(profile.phone)
		cy.get(profileSelectors.setupPhoneInput).clear().type(formattedPhone)

		if (profile.professions.length > 0) {
			cy.get(profileSelectors.userProfileProfessionSelector).should(
				'be.visible',
			)
			cy.get(profileSelectors.userProfileProfessionComboBox).click()
			profile.professions.forEach((profession) => {
				cy.get(`[data-cy="user-profile-profession-${profession}"]`).click()
			})
		}

		if (profile.organization) {
			cy.get(profileSelectors.setupOrganizationInput)
				.clear()
				.type(profile.organization)
		}

		return this
	}

	clearName() {
		cy.get(profileSelectors.setupNameInput).clear()
		return this
	}

	clearPhone() {
		cy.get(profileSelectors.setupPhoneInput).clear()
		return this
	}

	clickSubmit() {
		cy.get(profileSelectors.setupSubmitButton).click()
		return this
	}

	verifyStillAtSetupPage() {
		cy.get(profileSelectors.setupPage, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		cy.url().should('include', PROFILE_ROUTES.SETUP)
		return this
	}

	verifyRedirectToHome() {
		cy.url().should('eq', Cypress.config().baseUrl + '/')
		return this
	}
}
