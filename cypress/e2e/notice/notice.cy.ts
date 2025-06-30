import {
	NoticeData,
	NoticeTestDataFactory,
} from '../../support/fixtures/notice/noticeTestData'
import { errorSelectors } from '../../support/page-objects/error/selectors'
import {
	CreateNoticePage,
	DetailNoticePage,
	EditNoticePage,
	NoticePage,
} from '../../support/page-objects'

describe('공지사항 CRUD 테스트', () => {
	let testNotice: NoticeData
	let updatedTestNotice: NoticeData
	let noticePage: NoticePage
	let createPage: CreateNoticePage
	let editPage: EditNoticePage
	let detailPage: DetailNoticePage

	beforeEach(() => {
		testNotice = NoticeTestDataFactory.createTestNotice()
		updatedTestNotice = NoticeTestDataFactory.createUpdatedTestNotice()

		// Page Object 인스턴스 생성
		noticePage = new NoticePage()
		createPage = new CreateNoticePage()
		editPage = new EditNoticePage()
		detailPage = new DetailNoticePage()

		cy.setupNoticeTest()
	})

	afterEach(() => {
		cy.cleanupTestData('notices')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('공지사항 조회', () => {
		beforeEach(() => {
			cy.createNoticeViaUI(testNotice)
		})

		it('공지사항 목록을 조회할 수 있다', () => {
			noticePage
				.verifyMinimumNoticeCount(1)
				.verifyNoticeExists(testNotice.title)
		})

		it('공지사항 상세 내용을 조회할 수 있다', () => {
			noticePage.clickFirstNotice()

			noticePage.verifyAtDetailPage()
			detailPage
				.verifyNoticeContent(testNotice.title, testNotice.content)
				.verifyBackButtonVisible()
		})
	})

	describe('공지사항 생성', () => {
		it('새로운 공지사항을 생성할 수 있다', () => {
			cy.createNoticeViaUI(testNotice)

			noticePage
				.verifyNoticeExists(testNotice.title)
				.verifyMinimumNoticeCount(1)
				.getNoticeCards()
				.contains(testNotice.title)
				.should('be.visible')
		})

		it('필수 입력 항목이 비어있으면 생성할 수 없다', () => {
			const fakeTitle = 'fake title'

			noticePage.clickCreateButton()

			createPage
				.verifyAtCreatePage()
				.fillTitleOnly(fakeTitle)
				.clickSubmit()
				.verifyStillAtCreatePage()
				.clickCancel()

			noticePage.verifyAtListPage().verifyNoticeNotExists(fakeTitle)
		})
	})

	describe('공지사항 수정', () => {
		beforeEach(() => {
			cy.createNoticeViaUI(testNotice)
		})

		it('기존 공지사항을 수정할 수 있다', () => {
			cy.editNoticeViaUI(testNotice, updatedTestNotice)
		})

		it('필수 입력 항목이 비어있으면 수정할 수 없다', () => {
			cy.goToNoticeDetailByTitle(testNotice.title)

			detailPage.clickEdit()

			editPage
				.verifyAtEditPage()
				.verifyFormHasValues(testNotice)
				.fillTitleAndClearContent(updatedTestNotice.title)
				.clickSubmit()
				.verifyStillAtEditPage()
				.clickCancel()
				.verifyNotAtEditPage()

			detailPage.verifyNoticeContent(testNotice.title, testNotice.content)
		})
	})

	describe('공지사항 삭제', () => {
		beforeEach(() => {
			cy.createNoticeViaUI(testNotice)
		})

		it('기존 공지사항을 삭제할 수 있다', () => {
			cy.deleteNoticeViaUI(testNotice)
		})

		it('삭제 확인 취소 시 공지사항이 삭제되지 않는다', () => {
			cy.goToNoticeDetailByTitle(testNotice.title)

			detailPage
				.clickDelete()
				.verifyDeleteConfirmationDialog()
				.cancelDelete()
				.verifyNoticeContent(testNotice.title, testNotice.content)
				.clickBack()

			noticePage.verifyAtListPage().verifyNoticeExists(testNotice.title)
		})
	})

	describe('에러 상황 처리', () => {
		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			cy.intercept('POST', '/api/trpc/notice.createNotice*', {
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
			}).as('createNoticeError')

			noticePage.clickCreateButton()

			createPage.verifyAtCreatePage().fillNoticeForm(testNotice).clickSubmit()

			cy.wait('@createNoticeError')

			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'공지사항 등록 오류',
			)
		})

		it('존재하지 않는 공지사항 접근 시 적절히 처리한다', () => {
			cy.visit('/notice/non-existent-id', { failOnStatusCode: false })
			cy.url().should('match', /\/(notice|404)/)
		})
	})
})
