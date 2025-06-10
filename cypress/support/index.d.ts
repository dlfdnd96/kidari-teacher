declare namespace Cypress {
	interface Chainable {
		/**
		 * 세션 쿠키를 직접 설정하는 로그인
		 * @param role - 사용자 역할
		 * @example cy.login('ADMIN')
		 */
		login(role: string): Chainable<void>
	}
}
