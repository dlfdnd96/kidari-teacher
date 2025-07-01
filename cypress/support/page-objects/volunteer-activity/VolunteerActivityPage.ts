import { volunteerActivitySelectors } from './selectors'
import {
	VOLUNTEER_ACTIVITY_ROUTES,
	VOLUNTEER_ACTIVITY_TIMEOUTS,
} from '../../constants/volunteer-activity'

export class VolunteerActivityPage {
	private baseUrl = VOLUNTEER_ACTIVITY_ROUTES.LIST

	visit() {
		cy.visit(VOLUNTEER_ACTIVITY_ROUTES.LIST, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.PAGE_LOAD,
		})
		this.waitForPageLoad()
		return this
	}

	waitForPageLoad() {
		cy.get(volunteerActivitySelectors.createButton, {
			timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE,
		}).should('be.visible')
		return this
	}

	clickCreateButton() {
		cy.get(volunteerActivitySelectors.createButton).should('be.visible').click()
		return this
	}

	getVolunteerActivityCards() {
		return cy.get(volunteerActivitySelectors.volunteerActivityCard)
	}

	verifyVolunteerActivityExists(title: string) {
		cy.contains(title, { timeout: VOLUNTEER_ACTIVITY_TIMEOUTS.ELEMENT_VISIBLE })
		return this
	}

	verifyVolunteerActivityNotExists(title: string) {
		cy.contains(title).should('not.exist')
		return this
	}

	clickVolunteerActivityByTitle(title: string) {
		cy.contains(title).click()
		return this
	}

	clickFirstVolunteerActivity() {
		this.getVolunteerActivityCards().first().click()
		return this
	}

	verifyAtListPage() {
		cy.url().should('eq', Cypress.config().baseUrl + this.baseUrl)
		return this
	}

	verifyAtDetailPage() {
		cy.url().should('include', this.baseUrl + '/')
		cy.url().should('not.eq', Cypress.config().baseUrl + this.baseUrl)
		return this
	}

	verifyMinimumVolunteerActivityCount(count: number) {
		this.getVolunteerActivityCards().should('have.length.at.least', count)
		return this
	}
}
