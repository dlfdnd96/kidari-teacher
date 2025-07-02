import { profileSelectors } from './selectors'
import { PROFILE_TIMEOUTS } from '../../constants'
import { ProfileData } from '../../fixtures/profile/profileTestData'

export class ProfileFormPage {
	verifyAtFormPage() {
		cy.get(profileSelectors.profileForm).should('be.visible')
		return this
	}

	verifyFormVisible() {
		cy.get(profileSelectors.profileForm).should('be.visible')
		cy.get(profileSelectors.profileNameInput).should('be.visible')
		return this
	}

	fillProfileForm(profile: ProfileData) {
		cy.get(profileSelectors.profileNameInput).clear().type(profile.name)
		return this
	}

	fillNameOnly(name: string) {
		cy.get(profileSelectors.profileNameInput).clear().type(name)
		return this
	}

	clearName() {
		cy.get(profileSelectors.profileNameInput).clear()
		return this
	}

	clickSubmit() {
		cy.get(profileSelectors.profileFormSubmit).click()
		return this
	}

	clickCancel() {
		cy.get(profileSelectors.profileFormCancel).click()
		return this
	}

	verifyStillAtFormPage() {
		cy.get(profileSelectors.profileForm, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyNotAtFormPage() {
		cy.get(profileSelectors.profileForm).should('not.exist')
		return this
	}
}
