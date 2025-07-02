import { profileSelectors } from './selectors'
import { PROFILE_TIMEOUTS } from '../../constants'
import { UserProfileData } from '../../fixtures/profile/profileTestData'

export class UserProfileFormPage {
	verifyAtFormPage() {
		cy.get(profileSelectors.userProfileForm).should('be.visible')
		return this
	}

	verifyFormVisible() {
		cy.get(profileSelectors.userProfileForm).should('be.visible')
		cy.get(profileSelectors.userProfilePhoneInput).should('be.visible')
		return this
	}

	fillUserProfileForm(profile: UserProfileData) {
		const formattedPhone = profile.phone.replace(
			/(\d{3})(\d{4})(\d{4})/,
			'$1-$2-$3',
		)
		cy.get(profileSelectors.userProfilePhoneInput).clear().type(formattedPhone)

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
			cy.get(profileSelectors.userProfileOrganizationInput)
				.clear()
				.type(profile.organization)
		}

		return this
	}

	clearPhone() {
		cy.get(profileSelectors.userProfilePhoneInput).clear()
		return this
	}

	verifyFormHasValues(profile: UserProfileData) {
		const formattedPhone = profile.phone.replace(
			/(\d{3})(\d{4})(\d{4})/,
			'$1-$2-$3',
		)
		cy.get(profileSelectors.userProfilePhoneInput).should(
			'have.value',
			formattedPhone,
		)

		if (profile.organization) {
			cy.get(profileSelectors.userProfileOrganizationInput).should(
				'have.value',
				profile.organization,
			)
		}
		return this
	}

	clickSubmit() {
		cy.get(profileSelectors.userProfileFormSubmit).click()
		return this
	}

	clickCancel() {
		cy.get(profileSelectors.userProfileFormCancel).click()
		return this
	}

	verifyStillAtFormPage() {
		cy.get(profileSelectors.userProfileForm, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyNotAtFormPage() {
		cy.get(profileSelectors.userProfileForm).should('not.exist')
		return this
	}
}
