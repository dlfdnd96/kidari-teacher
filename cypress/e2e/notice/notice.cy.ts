import {
	NoticeData,
	NoticeTestDataFactory,
} from '../../support/fixtures/notice/noticeTestData'
import {
	NoticeCreatePage,
	NoticeDeletePage,
	NoticeDetailPage,
	NoticeEditPage,
	NoticeListPage,
	NoticePage,
} from '../../support/page-objects'
import { errorSelectors } from '../../support/page-objects/error/selectors'
import { noticeSelectors } from '../../support/page-objects/notice/selectors'

describe('공지사항 CRUD 테스트', () => {
	let testNotice: NoticeData
	let updatedTestNotice: NoticeData

	beforeEach(() => {
		testNotice = NoticeTestDataFactory.createTestNotice()
		updatedTestNotice = NoticeTestDataFactory.createUpdatedTestNotice()

		cy.login('ADMIN')

		const noticePage = new NoticePage()
		noticePage.visit()
	})

	afterEach(() => {
		cy.cleanupTestData('notices')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('공지사항 조회', () => {
		it('공지사항 목록을 조회할 수 있다', () => {
			const noticeListPage = new NoticeListPage()
			noticeListPage.getNoticeCards().should('have.length.at.least', 0)

			cy.get(noticeSelectors.noticeList).should('be.visible')
		})

		it('공지사항 상세 내용을 조회할 수 있다', () => {
			const noticeDetailPage = new NoticeDetailPage()
			noticeDetailPage.getNoticeCards().should('have.length.at.least', 1)

			noticeDetailPage
				.clickFirstNoticeCard()
				.waitForDetailModal()
				.verifyDetailModalElements()
				.closeDetailModal()
		})
	})

	describe('공지사항 생성', () => {
		const noticeCreatePage = new NoticeCreatePage()

		it('새로운 공지사항을 생성할 수 있다', () => {
			noticeCreatePage.getNoticeCount().then((initialCount) => {
				const initialCountNumber = Number(initialCount)

				noticeCreatePage
					.clickCreateButton()
					.waitForCreateModal()
					.fillCreateForm(testNotice.title, testNotice.content)
					.submitCreateForm()
					.verifyNoticeCreated(testNotice.title, testNotice.content)

				noticeCreatePage.getNoticeCount().then((finalCount) => {
					const finalCountNumber = Number(finalCount)
					expect(finalCountNumber).to.be.greaterThan(initialCountNumber)
				})
			})
		})

		it('필수 입력 항목이 비어있으면 생성할 수 없다', () => {
			noticeCreatePage.getNoticeCount().then((initialCount) => {
				const initialCountNumber = Number(initialCount)

				noticeCreatePage.clickCreateButton().waitForCreateModal()

				noticeCreatePage
					.fillTitle(testNotice.title)
					.clickSubmitButton()
					.formVisible()

				noticeCreatePage.getNoticeCount().then((count) => {
					const countNumber = Number(count)
					expect(countNumber).to.be.equal(initialCountNumber)
				})
			})
		})
	})

	describe('공지사항 수정', () => {
		beforeEach(() => {
			const noticeCreatePage = new NoticeCreatePage()
			noticeCreatePage
				.clickCreateButton()
				.waitForCreateModal()
				.fillCreateForm(testNotice.title, testNotice.content)
				.submitCreateForm()
		})

		it('기존 공지사항을 수정할 수 있다', () => {
			const noticeEditPage = new NoticeEditPage()
			noticeEditPage
				.clickEditButton()
				.waitForEditForm()
				.fillEditForm(updatedTestNotice.title, updatedTestNotice.content)
				.submitEditForm()
				.verifyNoticeUpdated(updatedTestNotice.title, updatedTestNotice.content)
		})
	})

	describe('공지사항 삭제', () => {
		beforeEach(() => {
			const noticeCreatePage = new NoticeCreatePage()
			noticeCreatePage
				.clickCreateButton()
				.waitForCreateModal()
				.fillCreateForm(testNotice.title, testNotice.content)
				.submitCreateForm()
		})

		const noticeDeletePage = new NoticeDeletePage()

		it('기존 공지사항을 삭제할 수 있다', () => {
			noticeDeletePage.getNoticeCount().then((initialCount) => {
				const initialCountNumber = Number(initialCount)

				noticeDeletePage
					.clickDeleteButton()
					.confirmDelete()
					.verifyNoticeDeleted(testNotice.title)

				noticeDeletePage.getNoticeCount().then((count) => {
					const countNumber = Number(count)
					expect(countNumber).to.be.lessThan(initialCountNumber)
				})
			})
		})

		it('삭제 확인 취소 시 공지사항이 삭제되지 않는다', () => {
			noticeDeletePage.getNoticeCount().then((initialCount) => {
				const initialCountNumber = Number(initialCount)

				noticeDeletePage.clickDeleteButton()

				cy.get(noticeSelectors.deleteCancelButton).click()

				noticeDeletePage.getNoticeCount().then((count) => {
					const countNumber = Number(count)
					expect(countNumber).to.be.equal(initialCountNumber)
				})
			})
		})
	})

	describe('에러 상황 처리', () => {
		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			cy.intercept('POST', '/api/trpc/notice.createNotice*', {
				statusCode: 500,
			}).as('createNoticeError')

			const noticeCreatePage = new NoticeCreatePage()
			noticeCreatePage
				.clickCreateButton()
				.waitForCreateModal()
				.fillCreateForm(testNotice.title, testNotice.content)
				.clickSubmitButton()

			cy.wait('@createNoticeError')

			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'공지사항 등록 오류',
			)
			cy.get(errorSelectors.errorModalMessage).should(
				'contain',
				'Unexpected end of JSON input',
			)
		})
	})
})
