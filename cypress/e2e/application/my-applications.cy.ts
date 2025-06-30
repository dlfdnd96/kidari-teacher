import {
	ApplicationData,
	ApplicationTestDataFactory,
	VolunteerActivityTestData,
} from '../../support/fixtures/application/applicationTestData'
import { errorSelectors } from '../../support/page-objects/error/selectors'
import {
	MyApplicationPage,
	ApplicationCancelPage,
} from '../../support/page-objects'

describe('신청 내역 CRUD 테스트', () => {
	let testApplication: ApplicationData
	let testVolunteerActivity: VolunteerActivityTestData
	let pastVolunteerActivity: VolunteerActivityTestData
	let myApplicationPage: MyApplicationPage
	let cancelPage: ApplicationCancelPage

	beforeEach(() => {
		testApplication = ApplicationTestDataFactory.createTestApplication()
		testVolunteerActivity =
			ApplicationTestDataFactory.createVolunteerActivityTestData()
		pastVolunteerActivity =
			ApplicationTestDataFactory.createPastVolunteerActivityTestData()

		// Page Object 인스턴스 생성
		myApplicationPage = new MyApplicationPage()
		cancelPage = new ApplicationCancelPage()

		cy.setupApplicationTest()
	})

	afterEach(() => {
		cy.cleanupTestData('applications')
		cy.cleanupTestData('volunteer-activities')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('신청 내역 조회', () => {
		beforeEach(() => {
			cy.createApplicationViaUI(testVolunteerActivity, testApplication)
		})

		it.only('신청 내역 목록을 조회할 수 있다', () => {
			myApplicationPage
				.visit()
				.verifyMinimumApplicationCount(1)
				.verifyApplicationExists(testVolunteerActivity.title)
		})

		it('신청 내역 상세 내용을 조회할 수 있다', () => {
			myApplicationPage.clickFirstApplication()

			myApplicationPage.verifyAtVolunteerActivityDetail()
		})

		it('총 개수가 올바르게 표시된다', () => {
			myApplicationPage.visit().verifyTotalCount(1)
		})

		it('신청 상태가 올바르게 표시된다', () => {
			myApplicationPage
				.visit()
				.verifyApplicationStatus(testVolunteerActivity.title, '대기중')
		})
	})

	describe('신청 취소', () => {
		beforeEach(() => {
			cy.createApplicationViaUI(testVolunteerActivity, testApplication)
		})

		it('대기중 상태의 신청을 취소할 수 있다', () => {
			myApplicationPage.visit()

			myApplicationPage.verifyCancelButtonVisible(testVolunteerActivity.title)

			cy.cancelApplicationViaUI(testVolunteerActivity.title)

			myApplicationPage
				.visit()
				.verifyApplicationNotExists(testVolunteerActivity.title)
		})

		it('취소 확인 시 취소 모달이 표시된다', () => {
			myApplicationPage
				.visit()
				.clickCancelButtonForApplication(testVolunteerActivity.title)

			cancelPage
				.verifyCancelConfirmationDialog()
				.cancelCancel()
				.verifyDialogClosed()

			myApplicationPage.verifyApplicationExists(testVolunteerActivity.title)
		})

		it('취소 확인 취소 시 신청이 유지된다', () => {
			cy.attemptCancelApplicationViaUI(testVolunteerActivity.title)

			myApplicationPage.verifyApplicationExists(testVolunteerActivity.title)
		})
	})

	describe('신청 취소 제한', () => {
		beforeEach(() => {
			cy.createApplicationViaUI(pastVolunteerActivity, testApplication)
		})

		it('과거 봉사활동의 신청은 취소할 수 없다', () => {
			myApplicationPage
				.visit()
				.verifyCancelButtonNotVisible(pastVolunteerActivity.title)
		})
	})

	describe('페이지네이션', () => {
		it('페이지네이션이 올바르게 동작한다', () => {
			cy.createApplicationViaUI(testVolunteerActivity, testApplication)

			myApplicationPage.visit().verifyMinimumApplicationCount(1)

			cy.get('body').then(($body) => {
				if ($body.find('[data-cy="pagination"]').length > 0) {
					// 페이지네이션이 있는 경우 테스트
					cy.get('[data-cy="pagination"]').should('be.visible')
				}
			})
		})
	})

	describe('빈 상태', () => {
		it('신청 내역이 없을 때 빈 상태 메시지를 표시한다', () => {
			myApplicationPage.visit().verifyEmptyState()
		})
	})

	describe('에러 상황 처리', () => {
		beforeEach(() => {
			cy.createApplicationViaUI(testVolunteerActivity, testApplication)
		})

		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			cy.intercept('POST', '/api/trpc/application.deleteApplication*', {
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
			}).as('deleteApplicationError')

			myApplicationPage
				.visit()
				.clickCancelButtonForApplication(testVolunteerActivity.title)

			cancelPage.confirmCancel()

			cy.wait('@deleteApplicationError')

			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'봉사활동 신청 취소 오류',
			)
		})

		it('신청 목록 조회 실패 시 에러 상태를 표시한다', () => {
			cy.intercept('POST', '/api/trpc/application.getMyApplicationList*', {
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
			}).as('getApplicationListError')

			myApplicationPage.visit()

			cy.wait('@getApplicationListError')

			cy.contains('신청 내역을 불러올 수 없습니다').should('be.visible')
			cy.contains('다시 시도').should('be.visible')
		})

		it('재시도 버튼이 동작한다', () => {
			let callCount = 0
			cy.intercept(
				'POST',
				'/api/trpc/application.getMyApplicationList*',
				(req) => {
					callCount++
					if (callCount === 1) {
						req.reply({
							statusCode: 500,
							body: {
								error: {
									message: 'Internal Server Error',
									code: -32603,
								},
							},
						})
					} else {
						req.continue()
					}
				},
			).as('getApplicationListRetry')

			myApplicationPage.visit()

			cy.contains('다시 시도').click()

			myApplicationPage.verifyApplicationExists(testVolunteerActivity.title)
		})
	})

	describe('접근성 및 반응형', () => {
		beforeEach(() => {
			cy.createApplicationViaUI(testVolunteerActivity, testApplication)
		})

		it('모바일 화면에서 올바르게 표시된다', () => {
			cy.setViewport('mobile')

			myApplicationPage
				.visit()
				.verifyApplicationExists(testVolunteerActivity.title)
		})

		it('태블릿 화면에서 올바르게 표시된다', () => {
			cy.setViewport('tablet')

			myApplicationPage
				.visit()
				.verifyApplicationExists(testVolunteerActivity.title)
		})

		it('접근성 요구사항을 충족한다', () => {
			myApplicationPage.visit()

			cy.checkAccessibility()
		})
	})
})
