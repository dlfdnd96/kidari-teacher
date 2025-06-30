import {
	NoticeData,
	NoticeTestDataFactory,
} from '../../support/fixtures/notice/noticeTestData'
import { errorSelectors } from '../../support/page-objects/error/selectors'

describe('공지사항 CRUD 테스트', () => {
	let testNotice: NoticeData
	let updatedTestNotice: NoticeData

	beforeEach(() => {
		testNotice = NoticeTestDataFactory.createTestNotice()
		updatedTestNotice = NoticeTestDataFactory.createUpdatedTestNotice()

		// JWT 전략을 사용하는 NextAuth 로그인
		cy.login('ADMIN')

		// 공지사항 메인 페이지로 이동
		cy.visit('/notice')
	})

	afterEach(() => {
		cy.cleanupTestData('notices')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('공지사항 조회', () => {
		beforeEach(() => {
			// 테스트용 공지사항 생성
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()
			cy.url().should('include', '/notice/create')

			cy.get('[data-testid="create-notice-title-input"]').type(testNotice.title)
			cy.get('[data-testid="create-notice-content-input"]').type(
				testNotice.content,
			)
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// 목록 페이지로 돌아왔는지 확인
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')
		})

		it('공지사항 목록을 조회할 수 있다', () => {
			// 공지사항 카드가 최소 1개 이상 있는지 확인
			cy.get('[data-testid="notice-card"]').should('have.length.at.least', 1)

			// 생성한 공지사항이 목록에 표시되는지 확인
			cy.contains(testNotice.title).should('be.visible')
		})

		it('공지사항 상세 내용을 조회할 수 있다', () => {
			// 첫 번째 공지사항 카드 클릭
			cy.get('[data-testid="notice-card"]').first().click()

			// 상세 페이지로 이동했는지 확인
			cy.url().should('include', '/notice/')
			cy.url().should('not.eq', Cypress.config().baseUrl + '/notice')

			// 상세 내용이 표시되는지 확인
			cy.contains(testNotice.title).should('be.visible')
			cy.contains(testNotice.content).should('be.visible')

			// 뒤로가기 버튼 확인
			cy.contains('뒤로가기').should('be.visible')
		})
	})

	describe('공지사항 생성', () => {
		it('새로운 공지사항을 생성할 수 있다', () => {
			// 공지사항 작성 버튼 클릭
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()

			// 작성 페이지로 이동했는지 확인
			cy.url().should('include', '/notice/create')

			// 폼이 표시되는지 확인
			cy.get('[data-testid="create-notice-form-modal"]').should('be.visible')

			// 제목과 내용 입력
			cy.get('[data-testid="create-notice-title-input"]').type(testNotice.title)
			cy.get('[data-testid="create-notice-content-input"]').type(
				testNotice.content,
			)

			// 게시하기 버튼 클릭
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// 목록 페이지로 돌아왔는지 확인
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')

			// 새로운 공지사항이 생성되었는지 확인
			cy.contains(testNotice.title).should('be.visible')

			// 생성된 공지사항이 목록에 있는지 확인 (절대적 확인)
			cy.get('[data-testid="notice-card"]').should('have.length.at.least', 1)

			// 생성한 특정 공지사항이 존재하는지 확인
			cy.get('[data-testid="notice-card"]')
				.contains(testNotice.title)
				.should('be.visible')
		})

		it('필수 입력 항목이 비어있으면 생성할 수 없다', () => {
			const fakeTitle = 'fake title'
			// 공지사항 작성 버튼 클릭
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()

			// 작성 페이지로 이동했는지 확인
			cy.url().should('include', '/notice/create')

			// 제목만 입력하고 내용은 비워둠
			cy.get('[data-testid="create-notice-title-input"]').type(fakeTitle)

			// 게시하기 버튼 클릭
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// 여전히 작성 페이지에 있는지 확인 (유효성 검사 실패)
			cy.url().should('include', '/notice/create')

			// 뒤로가기 또는 취소 버튼으로 목록으로 돌아가기
			cy.contains('취소').click()
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')

			// 공지사항이 생성되지 않아야 함
			cy.get('[data-testid="notice-card"]')
				.contains(fakeTitle)
				.should('not.exist')
		})
	})

	describe('공지사항 수정', () => {
		beforeEach(() => {
			// 테스트용 공지사항 생성
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()
			cy.url().should('include', '/notice/create')

			cy.get('[data-testid="create-notice-title-input"]').type(testNotice.title)
			cy.get('[data-testid="create-notice-content-input"]').type(
				testNotice.content,
			)
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// 목록 페이지로 돌아왔는지 확인
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')
		})

		it('기존 공지사항을 수정할 수 있다', () => {
			// 생성한 공지사항 클릭하여 상세 페이지로 이동
			cy.contains(testNotice.title).click()

			// 상세 페이지에서 수정 버튼 클릭
			cy.contains('수정').should('be.visible').click()

			// 수정 페이지로 이동했는지 확인
			cy.url().should('include', '/edit')

			// 기존 내용이 폼에 채워져 있는지 확인
			cy.get('[data-testid="edit-notice-title-input"]').should(
				'have.value',
				testNotice.title,
			)
			cy.get('[data-testid="edit-notice-content-input"]').should(
				'have.value',
				testNotice.content,
			)

			// 제목과 내용 수정
			cy.get('[data-testid="edit-notice-title-input"]')
				.clear()
				.type(updatedTestNotice.title)
			cy.get('[data-testid="edit-notice-content-input"]')
				.clear()
				.type(updatedTestNotice.content)

			// 수정 완료 버튼 클릭
			cy.get('[data-testid="edit-notice-submit-button"]').click()

			// 상세 페이지로 돌아왔는지 확인
			cy.url().should('not.include', '/edit')

			// 수정된 내용이 표시되는지 확인
			cy.contains(updatedTestNotice.title).should('be.visible')
			cy.contains(updatedTestNotice.content).should('be.visible')
		})

		it('필수 입력 항목이 비어있으면 수정할 수 없다', () => {
			// 생성한 공지사항 클릭하여 상세 페이지로 이동
			cy.contains(testNotice.title).click()

			// 상세 페이지에서 수정 버튼 클릭
			cy.contains('수정').should('be.visible').click()

			// 수정 페이지로 이동했는지 확인
			cy.url().should('include', '/edit')

			// 기존 내용이 폼에 채워져 있는지 확인
			cy.get('[data-testid="edit-notice-title-input"]').should(
				'have.value',
				testNotice.title,
			)
			cy.get('[data-testid="edit-notice-content-input"]').should(
				'have.value',
				testNotice.content,
			)

			// 제목만 입력하고 내용은 비워둠
			cy.get('[data-testid="edit-notice-title-input"]').type(
				updatedTestNotice.title,
			)
			cy.get('[data-testid="edit-notice-content-input"]').clear()

			// 수정 완료 버튼 클릭
			cy.get('[data-testid="edit-notice-submit-button"]').click()

			// 여전히 작성 페이지에 있는지 확인 (유효성 검사 실패)
			cy.url().should('include', '/edit')

			// 뒤로가기 또는 취소 버튼으로 목록으로 돌아가기
			cy.contains('취소').click()
			cy.url().should('include', '/notice/')
			cy.url().should('not.include', '/edit')

			// 수정되지 않은 내용이 표시되는지 확인
			cy.contains(testNotice.title).should('be.visible')
			cy.contains(testNotice.content).should('be.visible')
		})
	})

	describe('공지사항 삭제', () => {
		beforeEach(() => {
			// 테스트용 공지사항 생성
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()
			cy.url().should('include', '/notice/create')

			cy.get('[data-testid="create-notice-title-input"]').type(testNotice.title)
			cy.get('[data-testid="create-notice-content-input"]').type(
				testNotice.content,
			)
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// 목록 페이지로 돌아왔는지 확인
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')
		})

		it('기존 공지사항을 삭제할 수 있다', () => {
			// 생성한 공지사항 클릭하여 상세 페이지로 이동
			cy.contains(testNotice.title).click()

			// 상세 페이지에서 삭제 버튼 클릭
			cy.contains('삭제').should('be.visible').click()

			// 삭제 확인 다이얼로그가 표시되는지 확인
			cy.contains('공지사항을 삭제하시겠습니까?').should('be.visible')

			// 삭제 확인 버튼 클릭
			cy.get('[data-testid="delete-notice-button"]').click()

			// 목록 페이지로 돌아왔는지 확인
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')

			// 삭제된 공지사항이 목록에서 사라졌는지 확인
			cy.contains(testNotice.title).should('not.exist')
		})

		it('삭제 확인 취소 시 공지사항이 삭제되지 않는다', () => {
			// 생성한 공지사항 클릭하여 상세 페이지로 이동
			cy.contains(testNotice.title).click()

			// 상세 페이지에서 삭제 버튼 클릭
			cy.contains('삭제').should('be.visible').click()

			// 삭제 확인 다이얼로그가 표시되는지 확인
			cy.contains('공지사항을 삭제하시겠습니까?').should('be.visible')

			// 취소 버튼 클릭
			cy.get('[data-testid="cancel-delete-notice-button"]').click()

			// 여전히 상세 페이지에 있는지 확인
			cy.contains(testNotice.title).should('be.visible')
			cy.contains(testNotice.content).should('be.visible')

			// 목록 페이지로 돌아가기
			cy.contains('뒤로가기').click()
			cy.url().should('eq', Cypress.config().baseUrl + '/notice')

			// 공지사항이 여전히 존재하는지 확인
			cy.contains(testNotice.title).should('be.visible')
		})
	})

	describe('에러 상황 처리', () => {
		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			// 공지사항 생성 API 요청을 가로채서 에러 응답 반환
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

			// 공지사항 작성 버튼 클릭
			cy.get('[data-testid="create-notice-button"]')
				.should('be.visible')
				.click()

			// 작성 페이지로 이동했는지 확인
			cy.url().should('include', '/notice/create')

			// 제목과 내용 입력
			cy.get('[data-testid="create-notice-title-input"]').type(testNotice.title)
			cy.get('[data-testid="create-notice-content-input"]').type(
				testNotice.content,
			)

			// 게시하기 버튼 클릭
			cy.get('[data-testid="create-submit-notice-button"]').click()

			// API 요청이 실행되었는지 확인
			cy.wait('@createNoticeError')

			// 에러 모달이 표시되는지 확인
			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'공지사항 등록 오류',
			)
		})

		it('존재하지 않는 공지사항 접근 시 적절히 처리한다', () => {
			// 존재하지 않는 ID로 상세 페이지 접근
			cy.visit('/notice/non-existent-id', { failOnStatusCode: false })

			// 목록 페이지로 리다이렉트되거나 404 페이지가 표시되는지 확인
			cy.url().should('match', /\/(notice|404)/)
		})
	})
})
