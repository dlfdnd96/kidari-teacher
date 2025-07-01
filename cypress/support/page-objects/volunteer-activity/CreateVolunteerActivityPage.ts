import { volunteerActivitySelectors } from './selectors'
import { VolunteerActivityPage } from './VolunteerActivityPage'
import { VolunteerActivityTestData } from '../../fixtures/volunteer-activity/volunteerActivityTestData'
import { VOLUNTEER_ACTIVITY_ROUTES } from '../../constants/volunteer-activity'

export class CreateVolunteerActivityPage extends VolunteerActivityPage {
	verifyAtCreatePage() {
		cy.url().should('include', VOLUNTEER_ACTIVITY_ROUTES.CREATE)
		return this
	}

	fillVolunteerActivityForm(activity: VolunteerActivityTestData) {
		cy.get(volunteerActivitySelectors.createTitleInput).type(activity.title)
		cy.get(volunteerActivitySelectors.createDescriptionInput).type(
			activity.description,
		)
		cy.get(volunteerActivitySelectors.createLocationInput)
			.invoke('removeAttr', 'readonly')
			.type(activity.location)
		this.setStartDateTime(activity.startDate, activity.startTime)
		this.setEndDateTime(activity.endDate, activity.endTime)
		this.setApplicationDeadline(activity.applicationDeadline)
		cy.get(volunteerActivitySelectors.createMaxParticipantsInput)
			.clear()
			.type(activity.maxParticipants)

		return this
	}

	fillTitleOnly(title: string) {
		cy.get(volunteerActivitySelectors.createTitleInput).type(title)
		return this
	}

	clickSubmit() {
		cy.get(volunteerActivitySelectors.createSubmitButton).click()
		return this
	}

	clickCancel() {
		cy.get(volunteerActivitySelectors.createCancelButton).click()
		return this
	}

	verifyStillAtCreatePage() {
		cy.url().should('include', VOLUNTEER_ACTIVITY_ROUTES.CREATE)
		return this
	}

	private setStartDateTime(date: string, time: string) {
		this.setDateTime(
			date,
			{
				popover: volunteerActivitySelectors.createStartAtPopOver,
				input: volunteerActivitySelectors.createStartAtInput,
			},
			time,
		)
		return this
	}

	private setEndDateTime(date: string, time: string) {
		this.setDateTime(
			date,
			{
				popover: volunteerActivitySelectors.createEndAtPopOver,
				input: volunteerActivitySelectors.createEndAtInput,
			},
			time,
		)
		return this
	}

	private setApplicationDeadline(date: string) {
		this.setDateTime(date, {
			popover: volunteerActivitySelectors.createApplicationDeadlinePopOver,
		})
		return this
	}

	private setDateTime(
		date: string,
		selector: { popover: string; input?: string },
		time?: string,
	) {
		cy.get(selector.popover).click()

		const [_year, _month, day] = date.split('-')
		const dayNumber = parseInt(day, 10)

		cy.get('[role="gridcell"]').contains(dayNumber.toString()).first().click()

		if (selector.input && time) {
			cy.get(selector.input).should('be.visible').clear().type(time)
		}

		cy.get('body').click(0, 0)
	}
}
