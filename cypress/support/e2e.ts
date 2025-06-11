import './commands'
import 'cypress-axe'

// 전역 설정
Cypress.on('uncaught:exception', (error, _runnable) => {
	// React의 개발 모드에서 발생하는 일부 에러 무시
	if (error.message.includes('ResizeObserver loop limit exceeded')) {
		return false
	}

	// Next.js의 hydration 에러 등 무시할 에러들
	if (error.message.includes('Hydration failed')) {
		console.warn('Hydration error ignored in test:', error.message)
		return false
	}

	return true
})

// 테스트 실행 전 전역 설정
beforeEach(() => {
	// 각 테스트마다 테스트 실행 ID 설정
	if (!Cypress.env('testRunId')) {
		cy.task('generateTestRunId').then((id) => {
			Cypress.env('testRunId', id)
		})
	}

	// 브라우저 콘솔 에러 수집
	cy.window().then((win) => {
		// 콘솔 에러를 배열로 수집하는 방식으로 변경
		const originalError = win.console.error
		const errors: string[] = []

		win.console.error = (...args: any[]) => {
			errors.push(args.map((arg) => String(arg)).join(' '))
			originalError.apply(win.console, args)
		}

		// 에러 배열을 윈도우 객체에 저장
		;(win as any).testConsoleErrors = errors
	})

	// 네트워크 요청 모니터링 (성능 테스트용)
	cy.intercept('**', (req) => {
		req.continue()
	}).as('allRequests')
})

// 테스트 실행 후 정리
afterEach(() => {
	// 콘솔 에러 확인 (옵셔널)
	if (Cypress.env('enableDebugMode')) {
		cy.window().then((win) => {
			const errors = (win as any).testConsoleErrors || []
			if (errors.length > 0) {
				console.warn('Console errors detected:', errors)
			}
		})
	}
})
