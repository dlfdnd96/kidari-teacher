import { profileSelectors } from './selectors'
import { PROFILE_ROUTES, PROFILE_TIMEOUTS } from '../../constants/profile'
import { formatPhoneNumber } from '../utils'

export class ProfilePage {
	visit() {
		cy.visit(PROFILE_ROUTES.MAIN)
		cy.get(profileSelectors.profileCard, {
			timeout: PROFILE_TIMEOUTS.PAGE_LOAD,
		}).should('be.visible')
		return this
	}

	verifyAtProfilePage() {
		cy.url().should('include', PROFILE_ROUTES.MAIN)
		return this
	}

	verifyProfileCardVisible() {
		cy.get(profileSelectors.profileCard).should('be.visible')
		return this
	}

	verifyProfileName(name: string) {
		cy.get(profileSelectors.profileName).should('contain', name)
		return this
	}

	clickEditProfile() {
		cy.get(profileSelectors.profileEditButton).click()
		cy.get(profileSelectors.profileForm, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyUserProfileCardEmpty() {
		cy.get(profileSelectors.userProfileCardEmpty).should('be.visible')
		return this
	}

	verifyUserProfileCard() {
		cy.get(profileSelectors.userProfileCard).should('be.visible')
		return this
	}

	verifyUserProfileInfo(phone: string, organization?: string) {
		cy.get(profileSelectors.userProfilePhone).should(
			'contain',
			formatPhoneNumber(phone),
		)
		if (organization) {
			cy.get(profileSelectors.userProfileCard).should('contain', organization)
		}
		return this
	}

	clickCreateUserProfile() {
		cy.get(profileSelectors.userProfileCreateButton).click()
		cy.get(profileSelectors.userProfileForm, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	clickEditUserProfile() {
		cy.get(profileSelectors.userProfileEditButton).click()
		cy.get(profileSelectors.userProfileForm, {
			timeout: PROFILE_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	verifyPageLoaded() {
		cy.get(profileSelectors.profileCard).should('be.visible')
		return this
	}
}
