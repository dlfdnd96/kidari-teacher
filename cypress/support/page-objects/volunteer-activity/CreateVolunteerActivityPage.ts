import { volunteerActivitySelectors } from './selectors'
import { VolunteerActivityPage } from './VolunteerActivityPage'
import { VolunteerActivityTestData } from '../../fixtures/volunteer-activity/volunteerActivityTestData'
import { VOLUNTEER_ACTIVITY_ROUTES } from '../../constants'
import { ZodType } from '../../../../src/shared/types'
import { Enum, ZodEnum } from '../../../../src/enums'

export class CreateVolunteerActivityPage extends VolunteerActivityPage {
	private readonly VOLUNTEER_ACTIVITY_STATUS_LABELS = {
		[Enum.VolunteerActivityStatus.PLANNING]: '일정 계획 중',
		[Enum.VolunteerActivityStatus.RECRUITING]: '신청 접수 중',
		[Enum.VolunteerActivityStatus.SELECTED]: '선발 완료',
		[Enum.VolunteerActivityStatus.IN_PROGRESS]: '교육 진행 중',
		[Enum.VolunteerActivityStatus.COMPLETED]: '완료',
		[Enum.VolunteerActivityStatus.CANCELLED]: '취소됨',
	} as const
	private readonly MONTH_NAMES = [
		'1월',
		'2월',
		'3월',
		'4월',
		'5월',
		'6월',
		'7월',
		'8월',
		'9월',
		'10월',
		'11월',
		'12월',
	] as const

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
		this.setStatus(activity.status)
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

		const [_year, month, day] = date.split('-')
		const monthNumber = parseInt(month, 10)
		const dayNumber = parseInt(day, 10)

		this.setMonth(monthNumber)
		cy.get('[role="gridcell"]').contains(dayNumber.toString()).first().click()

		if (selector.input && time) {
			cy.get(selector.input).should('be.visible').clear().type(time)
		}

		cy.get('body').click(0, 0)
	}

	private setMonth(month: number) {
		const monthIndex = month - 1
		const monthName = this.MONTH_NAMES[monthIndex]

		cy.get('body').then(($body) => {
			const monthDropdownSelectors = [
				'[role="combobox"]:last',
				'[data-testid="month-selector"]',
				'.calendar-month-selector',
				'[aria-label*="월"], [aria-label*="Month"]',
			]

			for (const selector of monthDropdownSelectors) {
				if ($body.find(selector).length > 0) {
					cy.get(selector)
						.first()
						.then(($monthDropdown) => {
							const currentMonth = $monthDropdown.text().trim()
							if (!currentMonth.includes(monthName)) {
								cy.wrap($monthDropdown).click()
								cy.get('[role="option"]').contains(monthName).click()
							}
						})
					break
				}
			}
		})
	}

	private setStatus(status: ZodType<typeof ZodEnum.VolunteerActivityStatus>) {
		cy.get(volunteerActivitySelectors.createStatusTrigger).click()
		cy.get(volunteerActivitySelectors.createStatusContent)
			.contains(this.VOLUNTEER_ACTIVITY_STATUS_LABELS[status])
			.click()
	}
}
