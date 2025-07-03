import {
	VolunteerActivityTestData,
	VolunteerActivityTestDataFactory,
} from '../../support/fixtures/volunteer-activity/volunteerActivityTestData'
import { errorSelectors } from '../../support/page-objects/error/selectors'
import {
	CreateVolunteerActivityPage,
	DetailVolunteerActivityPage,
	EditVolunteerActivityPage,
	VolunteerActivityPage,
} from '../../support/page-objects'

describe('봉사활동 CRUD 테스트', () => {
	let testVolunteerActivity: VolunteerActivityTestData
	let updatedTestVolunteerActivity: VolunteerActivityTestData
	let volunteerActivityPage: VolunteerActivityPage
	let createPage: CreateVolunteerActivityPage
	let editPage: EditVolunteerActivityPage
	let detailPage: DetailVolunteerActivityPage

	beforeEach(() => {
		testVolunteerActivity =
			VolunteerActivityTestDataFactory.createTestVolunteerActivity()
		updatedTestVolunteerActivity =
			VolunteerActivityTestDataFactory.createUpdatedTestVolunteerActivity()

		// Page Object 인스턴스 생성
		volunteerActivityPage = new VolunteerActivityPage()
		createPage = new CreateVolunteerActivityPage()
		editPage = new EditVolunteerActivityPage()
		detailPage = new DetailVolunteerActivityPage()

		cy.setupVolunteerActivityTest()
	})

	afterEach(() => {
		cy.cleanupTestData('volunteer-activities')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('봉사활동 조회', () => {
		beforeEach(() => {
			cy.createVolunteerActivityViaUI(testVolunteerActivity)
		})

		it('봉사활동 목록을 조회할 수 있다', () => {
			volunteerActivityPage
				.verifyMinimumVolunteerActivityCount(1)
				.verifyVolunteerActivityExists(testVolunteerActivity.title)
		})

		it('봉사활동 상세 내용을 조회할 수 있다', () => {
			volunteerActivityPage.clickFirstVolunteerActivity()

			volunteerActivityPage.verifyAtDetailPage()
			detailPage
				.verifyVolunteerActivityContent(
					testVolunteerActivity.title,
					testVolunteerActivity.description,
				)
				.verifyBackButtonVisible()
		})
	})

	describe('봉사활동 생성', () => {
		it('새로운 봉사활동을 생성할 수 있다', () => {
			cy.createVolunteerActivityViaUI(testVolunteerActivity)

			volunteerActivityPage
				.verifyVolunteerActivityExists(testVolunteerActivity.title)
				.verifyMinimumVolunteerActivityCount(1)
				.getVolunteerActivityCards()
				.contains(testVolunteerActivity.title)
				.should('be.visible')
		})

		it('필수 입력 항목이 비어있으면 생성할 수 없다', () => {
			const fakeTitle = 'fake title'

			volunteerActivityPage.clickCreateButton()

			createPage
				.verifyAtCreatePage()
				.fillTitleOnly(fakeTitle)
				.clickSubmit()
				.verifyStillAtCreatePage()
				.clickCancel()

			volunteerActivityPage
				.verifyAtListPage()
				.verifyVolunteerActivityNotExists(fakeTitle)
		})
	})

	describe('봉사활동 수정', () => {
		beforeEach(() => {
			cy.createVolunteerActivityViaUI(testVolunteerActivity)
		})

		it('기존 봉사활동을 수정할 수 있다', () => {
			cy.editVolunteerActivityViaUI(
				testVolunteerActivity,
				updatedTestVolunteerActivity,
			)
		})

		it('필수 입력 항목이 비어있으면 수정할 수 없다', () => {
			cy.goToVolunteerActivityDetailByTitle(testVolunteerActivity.title)

			detailPage.clickEdit()

			editPage
				.verifyAtEditPage()
				.verifyFormHasValues(testVolunteerActivity)
				.fillTitleAndClearDescription(updatedTestVolunteerActivity.title)
				.clickSubmit()
				.verifyStillAtEditPage()
				.clickCancel()
				.verifyNotAtEditPage()

			detailPage.verifyVolunteerActivityContent(
				testVolunteerActivity.title,
				testVolunteerActivity.description,
			)
		})
	})

	describe('봉사활동 삭제', () => {
		beforeEach(() => {
			cy.createVolunteerActivityViaUI(testVolunteerActivity)
		})

		it('기존 봉사활동을 삭제할 수 있다', () => {
			cy.deleteVolunteerActivityViaUI(testVolunteerActivity)
		})

		it('삭제 확인 취소 시 봉사활동이 삭제되지 않는다', () => {
			cy.goToVolunteerActivityDetailByTitle(testVolunteerActivity.title)

			detailPage
				.clickDelete()
				.verifyDeleteConfirmationDialog()
				.cancelDelete()
				.verifyVolunteerActivityContent(
					testVolunteerActivity.title,
					testVolunteerActivity.description,
				)
				.clickBack()

			volunteerActivityPage
				.verifyAtListPage()
				.verifyVolunteerActivityExists(testVolunteerActivity.title)
		})
	})

	describe('에러 상황 처리', () => {
		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			cy.intercept(
				'POST',
				'/api/trpc/volunteerActivity.createVolunteerActivity*',
				{
					statusCode: 500,
					body: {
						error: {
							message: 'Internal Server Error',
							code: -32603,
							data: {
								code: 'INTERNAL_SERVER_ERROR',
								httpStatus: 500,
							},
						},
					},
				},
			).as('createVolunteerActivityError')

			volunteerActivityPage.clickCreateButton()

			createPage
				.verifyAtCreatePage()
				.fillVolunteerActivityForm(testVolunteerActivity)
				.clickSubmit()

			cy.wait('@createVolunteerActivityError')

			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'봉사활동 등록 오류',
			)
		})

		it('존재하지 않는 봉사활동 접근 시 적절히 처리한다', () => {
			cy.visit('/volunteer-activities/non-existent-id', {
				failOnStatusCode: false,
			})
			cy.url().should('match', /\/(volunteer-activities|404)/)
		})
	})
})
