import { volunteerActivitySelectors } from './selectors'
import { VolunteerActivityPage } from './VolunteerActivityPage'
import { VolunteerActivityTestData } from '../../fixtures/volunteer-activity/volunteerActivityTestData'

export class EditVolunteerActivityPage extends VolunteerActivityPage {
	verifyAtEditPage() {
		cy.url().should('include', '/edit')
		return this
	}

	verifyFormHasValues(activity: VolunteerActivityTestData) {
		cy.get(volunteerActivitySelectors.editTitleInput).should(
			'have.value',
			activity.title,
		)
		cy.get(volunteerActivitySelectors.editDescriptionInput).should(
			'have.value',
			activity.description,
		)
		cy.get(volunteerActivitySelectors.editLocationInput).should(
			'have.value',
			activity.location,
		)
		return this
	}

	clearAndFillForm(activity: VolunteerActivityTestData) {
		cy.get(volunteerActivitySelectors.editTitleInput)
			.clear()
			.type(activity.title)
		cy.get(volunteerActivitySelectors.editDescriptionInput)
			.clear()
			.type(activity.description)
		cy.get(volunteerActivitySelectors.editLocationInput)
			.invoke('removeAttr', 'readonly')
			.clear()
			.type(activity.location)
		this.setStartDateTime(activity.startDate, activity.startTime)
		this.setEndDateTime(activity.endDate, activity.endTime)
		this.setApplicationDeadline(activity.applicationDeadline)
		cy.get(volunteerActivitySelectors.editMaxParticipantsInput)
			.clear()
			.type(activity.maxParticipants)

		return this
	}

	fillTitleAndClearDescription(title: string) {
		cy.get(volunteerActivitySelectors.editTitleInput).clear().type(title)
		cy.get(volunteerActivitySelectors.editDescriptionInput).clear()
		return this
	}

	clickSubmit() {
		cy.get(volunteerActivitySelectors.editSubmitButton).click()
		return this
	}

	clickCancel() {
		cy.get(volunteerActivitySelectors.editCancelButton).click()
		return this
	}

	verifyStillAtEditPage() {
		cy.url().should('include', '/edit')
		return this
	}

	verifyNotAtEditPage() {
		cy.url().should('not.include', '/edit')
		return this
	}

	private setStartDateTime(date: string, time: string) {
		this.setDateTime(
			date,
			{
				popover: volunteerActivitySelectors.editStartAtPopOver,
				input: volunteerActivitySelectors.editStartAtInput,
			},
			time,
		)
		return this
	}

	private setEndDateTime(date: string, time: string) {
		this.setDateTime(
			date,
			{
				popover: volunteerActivitySelectors.editEndAtPopOver,
				input: volunteerActivitySelectors.editEndAtInput,
			},
			time,
		)
		return this
	}

	private setApplicationDeadline(date: string) {
		this.setDateTime(date, {
			popover: volunteerActivitySelectors.editApplicationDeadlinePopOver,
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
