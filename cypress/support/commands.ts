import './commands/notice'
import { z } from 'zod/v4-mini'

Cypress.Commands.add(
	'login',
	(role: string, options?: { timeout?: number }) => {
		const { timeout = 10000 } = options || {}

		cy.task('serverLog', `로그인 시도: ${role}`)

		cy.request({
			method: 'POST',
			url: '/api/cypress-login',
			body: { role, ...Cypress.env() },
			timeout,
		}).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body).to.have.property('success', true)

			cy.task('serverLog', `로그인 성공: ${role}`)

			// JWT 토큰이 쿠키에 설정되었는지 확인
			cy.getCookie('next-auth.session-token').should('exist')

			// 세션이 유효한지 확인 (JWT 토큰 검증)
			cy.request({
				method: 'GET',
				url: '/api/auth/session',
				failOnStatusCode: false,
			}).then((sessionResponse) => {
				expect(sessionResponse.status).to.eq(200)
				expect(sessionResponse.body).to.have.property('user')
				cy.task('serverLog', 'JWT 세션 검증 완료')
			})
		})
	},
)

// 테스트 데이터 정리 명령어
Cypress.Commands.add('cleanupTestData', (dataType: string) => {
	cy.task('serverLog', `테스트 데이터 정리: ${dataType}`)

	cy.request({
		method: 'DELETE',
		url: `/api/cypress-cleanup/${dataType}`,
		body: {
			testRun: Cypress.env('testRunId') || 'default',
			params: { dataType },
			...Cypress.env(),
		},
		failOnStatusCode: false,
	}).then((response) => {
		if (response.status === 200) {
			cy.task('serverLog', `${dataType} 데이터 정리 완료`)
		} else {
			cy.task('serverLog', `${dataType} 데이터 정리 실패 또는 불필요`)
		}
	})
})

// API 인터셉트 헬퍼
Cypress.Commands.add(
	'interceptAPI',
	(method: string, url: string, alias: string, response?: any) => {
		const httpMethod = z
			.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
			.parse(method)
		if (response) {
			cy.intercept(httpMethod, url, response).as(alias)
		} else {
			cy.intercept(httpMethod, url).as(alias)
		}
		cy.task('serverLog', `API 인터셉트 설정: ${httpMethod} ${url} as ${alias}`)
	},
)

// 로딩 상태 대기
Cypress.Commands.add('waitForLoading', (selector?: string) => {
	const loadingSelector = selector || '[data-cy="loading"]'

	// 로딩이 시작되기를 기다림
	cy.get('body').then(($body) => {
		if ($body.find(loadingSelector).length > 0) {
			// 로딩이 있다면 사라질 때까지 대기
			cy.get(loadingSelector).should('not.exist')
		}
	})
})

// 토스트/스낵바 메시지 확인
Cypress.Commands.add(
	'checkToast',
	(
		message: string,
		type: 'success' | 'error' | 'warning' | 'info' = 'success',
	) => {
		cy.get(`[data-cy="toast-${type}"]`, { timeout: 10000 })
			.should('be.visible')
			.and('contain.text', message)

		// 토스트가 자동으로 사라지는지 확인
		cy.get(`[data-cy="toast-${type}"]`, { timeout: 15000 }).should('not.exist')
	},
)

// 페이지 접근성 검사
Cypress.Commands.add('checkAccessibility', () => {
	cy.injectAxe()
	cy.checkA11y(undefined, undefined, (violations) => {
		violations.forEach((violation) => {
			cy.task(
				'serverLog',
				`접근성 위반: ${violation.id} - ${violation.description}`,
			)
		})
	})
})

// 반응형 테스트를 위한 뷰포트 설정
Cypress.Commands.add(
	'setViewport',
	(device: 'mobile' | 'tablet' | 'desktop') => {
		const viewports = {
			mobile: [375, 667], // iPhone SE/8 크기
			tablet: [768, 1024], // iPad 크기
			desktop: [1920, 1080], // 일반적인 데스크톱 크기
		} as const

		const [width, height] = viewports[device]
		cy.viewport(width, height)
		cy.task('serverLog', `뷰포트 설정: ${device} (${width}x${height})`)
	},
)

// 로컬 스토리지 및 세션 스토리지 정리
Cypress.Commands.add('clearBrowserData', () => {
	cy.clearAllCookies()
	cy.clearAllLocalStorage()
	cy.clearAllSessionStorage()
	cy.task('serverLog', '브라우저 데이터 정리 완료')
})

// 파일 업로드 헬퍼 (drag & drop 지원)
Cypress.Commands.add(
	'uploadFile',
	(selector: string, fileName: string, fileType: string = 'image/png') => {
		cy.fixture(fileName, 'base64').then((fileContent) => {
			const blob = Cypress.Blob.base64StringToBlob(fileContent, fileType)
			const file = new File([blob], fileName, { type: fileType })

			cy.get(selector).then((element) => {
				const dataTransfer = new DataTransfer()
				dataTransfer.items.add(file)

				const changeEvent = new Event('change', { bubbles: true })
				Object.defineProperty(changeEvent, 'target', {
					writable: false,
					value: element[0],
				})
				Object.defineProperty(element[0], 'files', {
					writable: false,
					value: dataTransfer.files,
				})

				element[0].dispatchEvent(changeEvent)
			})
		})
	},
)
