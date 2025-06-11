describe('공지사항 CRUD 테스트', () => {
	const testNotice = {
		title: '테스트 공지사항',
		content: '테스트 공지사항 내용입니다.',
	}
	const updatedTestNotice = {
		title: '수정된 테스트 공지사항',
		content: '수정된 테스트 공지사항 내용입니다.',
	}

	beforeEach(() => {
		cy.login('ADMIN')
		cy.visit('/notice')
	})

	it('공지사항 상세 조회', () => {
		cy.get('[data-testid="notice-card"]').first().click()

		cy.get('[data-testid="notice-detail-modal"]').should('be.visible')

		cy.get('[data-testid="notice-detail-title"]').should('exist')
		cy.get('[data-testid="notice-detail-content"]').should('exist')
		cy.get('[data-testid="notice-detail-author"]').should('exist')
		cy.get('[data-testid="notice-detail-date"]').should('exist')

		cy.get('[data-testid="notice-detail-confirm"]').click()
	})

	it('공지사항 목록 조회', () => {
		cy.get('[data-testid="notice-list"]').should('exist')
		cy.get('[data-testid="notice-card"]').should('have.length.at.least', 0)
	})

	it('공지사항 생성', () => {
		cy.get('[data-testid="create-notice-button"]').click()
		cy.get('[data-testid="create-notice-form-modal"]').should('be.visible')

		cy.get('[data-testid="create-notice-form-modal"]')
			.find('[data-testid="notice-title-input"]')
			.should('be.visible')
			.type(testNotice.title)
		cy.get('[data-testid="create-notice-form-modal"]')
			.find('[data-testid="notice-content-input"]')
			.should('be.visible')
			.type(testNotice.content)

		cy.get('[data-testid="create-notice-form-modal"]')
			.find('[data-testid="submit-notice-button"]')
			.click()

		cy.get('[data-testid="create-notice-form-modal"]').should('not.exist')

		cy.get('[data-testid="notice-card"]')
			.first()
			.should('contain', testNotice.title)
			.and('contain', testNotice.content)
	})

	it('공지사항 수정', () => {
		cy.get('[data-testid="notice-card"]')
			.first()
			.find('[data-testid="edit-notice-button"]')
			.click()

		cy.get('[data-testid="notice-title-edit-input"]')
			.clear()
			.type(updatedTestNotice.title)
		cy.get('[data-testid="notice-content-edit-input"]')
			.clear()
			.type(updatedTestNotice.content)

		cy.get('[data-testid="submit-notice-edit-button"]').click()

		cy.get('[data-testid="notice-edit-form"]').should('not.exist')

		cy.get('[data-testid="notice-card"]')
			.first()
			.should('contain', updatedTestNotice.title)
			.and('contain', updatedTestNotice.content)
	})

	it('공지사항 삭제', () => {
		cy.get('[data-testid="notice-card"]')
			.first()
			.find('[data-testid="delete-notice-button"]')
			.click()

		cy.get('[data-testid="confirm-delete-button"]').should('be.visible')
		cy.get('[data-testid="confirm-delete-button"]').click()

		cy.get('[data-testid="confirm-delete-button"]').should('not.exist')

		cy.get('[data-testid="notice-card"]')
			.first()
			.should('not.contain', updatedTestNotice.title)
	})
})
