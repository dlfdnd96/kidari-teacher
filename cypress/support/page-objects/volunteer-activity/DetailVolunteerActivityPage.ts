import { VolunteerActivityPage } from './VolunteerActivityPage'
import { volunteerActivitySelectors } from './selectors'
import {
	VOLUNTEER_ACTIVITY_MESSAGES,
	VOLUNTEER_ACTIVITY_TIMEOUTS,
} from '../../constants/volunteer-activity'

export class DetailVolunteerActivityPage extends VolunteerActivityPage {
	verifyVolunteerActivityContent(title: string, description: string) {
		cy.contains(title, { timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE })
		cy.contains(description, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		})
		return this
	}

	verifyBackButtonVisible() {
		cy.contains(volunteerActivitySelectors.backButtonText, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		})
		return this
	}

	clickEdit() {
		cy.contains(volunteerActivitySelectors.editButtonText, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		}).click()
		return this
	}

	clickDelete() {
		cy.contains(volunteerActivitySelectors.deleteButtonText, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		}).click()
		return this
	}

	clickBack() {
		cy.contains(volunteerActivitySelectors.backButtonText).click()
		return this
	}

	verifyDeleteConfirmationDialog() {
		cy.contains(VOLUNTEER_ACTIVITY_MESSAGES.DELETE_CONFIRMATION, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		})
		return this
	}

	confirmDelete() {
		cy.get(volunteerActivitySelectors.confirmDeleteButton).click()
		return this
	}

	cancelDelete() {
		cy.get(volunteerActivitySelectors.cancelDeleteButton).click()
		return this
	}
}
