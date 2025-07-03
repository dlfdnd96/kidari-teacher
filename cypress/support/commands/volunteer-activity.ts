import { VolunteerActivityTestData } from '../fixtures/volunteer-activity/volunteerActivityTestData'
import {
	CreateVolunteerActivityPage,
	DetailVolunteerActivityPage,
	EditVolunteerActivityPage,
	VolunteerActivityPage,
} from '../page-objects'

Cypress.Commands.add(
	'createVolunteerActivityViaUI',
	(activity: VolunteerActivityTestData) => {
		const volunteerActivityPage = new VolunteerActivityPage()
		const createPage = new CreateVolunteerActivityPage()

		volunteerActivityPage.clickCreateButton()

		createPage
			.verifyAtCreatePage()
			.fillVolunteerActivityForm(activity)
			.clickSubmit()

		volunteerActivityPage.verifyAtListPage()
	},
)

Cypress.Commands.add(
	'editVolunteerActivityViaUI',
	(
		originalActivity: VolunteerActivityTestData,
		updatedActivity: VolunteerActivityTestData,
	) => {
		const volunteerActivityPage = new VolunteerActivityPage()
		const detailPage = new DetailVolunteerActivityPage()
		const editPage = new EditVolunteerActivityPage()

		volunteerActivityPage.clickVolunteerActivityByTitle(originalActivity.title)

		detailPage.clickEdit()

		editPage
			.verifyAtEditPage()
			.verifyFormHasValues(originalActivity)
			.clearAndFillForm(updatedActivity)
			.clickSubmit()
			.verifyNotAtEditPage()

		detailPage.verifyVolunteerActivityContent(
			updatedActivity.title,
			updatedActivity.description,
		)
	},
)

Cypress.Commands.add(
	'deleteVolunteerActivityViaUI',
	(activity: VolunteerActivityTestData) => {
		const volunteerActivityPage = new VolunteerActivityPage()
		const detailPage = new DetailVolunteerActivityPage()

		volunteerActivityPage.clickVolunteerActivityByTitle(activity.title)

		detailPage.clickDelete().verifyDeleteConfirmationDialog().confirmDelete()

		volunteerActivityPage
			.verifyAtListPage()
			.verifyVolunteerActivityNotExists(activity.title)
	},
)

Cypress.Commands.add('goToVolunteerActivityDetailByTitle', (title: string) => {
	const volunteerActivityPage = new VolunteerActivityPage()
	const detailPage = new DetailVolunteerActivityPage()

	volunteerActivityPage.clickVolunteerActivityByTitle(title)
	volunteerActivityPage.verifyAtDetailPage()
	detailPage.verifyBackButtonVisible()
})

Cypress.Commands.add('setupVolunteerActivityTest', () => {
	cy.login('ADMIN')
	new VolunteerActivityPage().visit()
})
