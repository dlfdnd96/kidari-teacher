import {
	ProfileData,
	UserProfileData,
	SetupProfileData,
} from '../fixtures/profile/profileTestData'
import {
	ProfilePage,
	ProfileFormPage,
	UserProfileFormPage,
	SetupPage,
} from '../page-objects'

Cypress.Commands.add('editProfileViaUI', (updatedProfile: ProfileData) => {
	const profilePage = new ProfilePage()
	const profileFormPage = new ProfileFormPage()

	profilePage.clickEditProfile()

	profileFormPage
		.verifyAtFormPage()
		.verifyFormVisible()
		.fillProfileForm(updatedProfile)
		.clickSubmit()

	profilePage.verifyAtProfilePage()
})

Cypress.Commands.add(
	'editUserProfileViaUI',
	(updatedUserProfile: UserProfileData) => {
		const profilePage = new ProfilePage()
		const userProfileFormPage = new UserProfileFormPage()

		profilePage.clickEditUserProfile()

		userProfileFormPage
			.verifyAtFormPage()
			.verifyFormVisible()
			.fillUserProfileForm(updatedUserProfile)
			.clickSubmit()

		profilePage.verifyAtProfilePage()
	},
)

Cypress.Commands.add(
	'createUserProfileViaUI',
	(userProfile: UserProfileData) => {
		const profilePage = new ProfilePage()
		const userProfileFormPage = new UserProfileFormPage()

		profilePage.clickCreateUserProfile()

		userProfileFormPage
			.verifyAtFormPage()
			.verifyFormVisible()
			.fillUserProfileForm(userProfile)
			.clickSubmit()

		profilePage.verifyAtProfilePage()
	},
)

Cypress.Commands.add('setupProfileViaUI', (setupProfile: SetupProfileData) => {
	const setupPage = new SetupPage()

	setupPage
		.verifyAtSetupPage()
		.verifyFormVisible()
		.fillSetupForm(setupProfile)
		.clickSubmit()

	setupPage.verifyRedirectToHome()
})

Cypress.Commands.add('goToProfile', () => {
	const profilePage = new ProfilePage()
	profilePage.visit()
})

Cypress.Commands.add('goToProfileSetup', () => {
	const setupPage = new SetupPage()
	setupPage.visit()
})

Cypress.Commands.add('setupProfileTest', () => {
	cy.login('USER')
	cy.goToProfile()
})
