import { ApplicationData } from '../fixtures/application/applicationTestData'
import {
	ApplicationCancelPage,
	ApplicationModalPage,
	MyApplicationPage,
	CreateVolunteerActivityPage,
	VolunteerActivityPage,
} from '../page-objects'
import { VolunteerActivityTestData } from '../fixtures/volunteer-activity/volunteerActivityTestData'

Cypress.Commands.add(
	'createApplicationViaUI',
	(
		volunteerActivity: VolunteerActivityTestData,
		application: ApplicationData,
	) => {
		cy.setupVolunteerActivityTest()

		const volunteerActivityPage = new VolunteerActivityPage()
		const createPage = new CreateVolunteerActivityPage()

		volunteerActivityPage.clickCreateButton()

		createPage
			.verifyAtCreatePage()
			.fillVolunteerActivityForm(volunteerActivity)
			.clickSubmit()

		volunteerActivityPage.verifyAtListPage()

		const applicationModal = new ApplicationModalPage()
		applicationModal.completeApplicationProcess(application)
	},
)

Cypress.Commands.add('cancelApplicationViaUI', (activityTitle: string) => {
	const myApplicationPage = new MyApplicationPage()
	const cancelPage = new ApplicationCancelPage()

	myApplicationPage.clickCancelButtonForApplication(activityTitle)

	cancelPage
		.verifyCancelConfirmationDialog()
		.confirmCancel()
		.waitForCancelComplete()

	myApplicationPage.verifyAtListPage().verifyApplicationNotExists(activityTitle)
})

Cypress.Commands.add(
	'attemptCancelApplicationViaUI',
	(activityTitle: string) => {
		const myApplicationPage = new MyApplicationPage()
		const cancelPage = new ApplicationCancelPage()

		myApplicationPage.clickCancelButtonForApplication(activityTitle)

		cancelPage
			.verifyCancelConfirmationDialog()
			.cancelCancel()
			.verifyDialogClosed()

		myApplicationPage.verifyAtListPage().verifyApplicationExists(activityTitle)
	},
)

Cypress.Commands.add(
	'goToVolunteerActivityDetailByTitle',
	(activityTitle: string) => {
		const myApplicationPage = new MyApplicationPage()

		myApplicationPage
			.clickApplicationByTitle(activityTitle)
			.verifyAtVolunteerActivityDetail()
	},
)

Cypress.Commands.add('setupApplicationTest', () => {
	cy.login('ADMIN')
	new MyApplicationPage().visit()
})
