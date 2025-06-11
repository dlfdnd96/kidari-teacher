import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',

		// 보안 설정
		chromeWebSecurity: false,

		// 파일 경로 설정
		supportFile: 'cypress/support/e2e.ts',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
		fixturesFolder: 'cypress/fixtures',

		// 스크린샷 및 비디오 설정
		screenshotOnRunFailure: true,
		screenshotsFolder: 'cypress/screenshots',
		video: !!process.env.CI,
		videosFolder: 'cypress/videos',
		videoCompression: 32,

		// 타임아웃 설정
		defaultCommandTimeout: 10000,
		requestTimeout: 15000,
		responseTimeout: 15000,
		pageLoadTimeout: 30000,

		// 병렬 실행 설정
		experimentalMemoryManagement: true,

		// 뷰포트 설정
		viewportWidth: 1280,
		viewportHeight: 720,

		// Node.js 이벤트 리스너
		setupNodeEvents(on, config) {
			// 환경별 설정 로드
			const environment = config.env?.environment || 'development'

			// 환경별 baseUrl 설정
			const urls: Record<string, string> = {
				development: 'http://localhost:3000',
				staging: 'https://staging.example.com',
				production: 'https://example.com',
			}

			config.baseUrl = urls[environment] || urls.development

			// 커스텀 태스크 등록
			on('task', {
				// 데이터베이스 시드 작업
				seedDatabase(data) {
					// 실제 구현에서는 데이터베이스 시드 로직 추가
					console.log('데이터베이스 시드:', data)
					return null
				},

				// 테스트 데이터 정리 작업
				cleanupTestData(options) {
					console.log('테스트 데이터 정리:', options)
					return null
				},

				// 로그 출력
				log(message) {
					console.log(message)
					return null
				},

				// 테스트 실행 ID 생성
				generateTestRunId() {
					return `test-run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
				},
			})

			// 브라우저 이벤트 처리
			on('before:browser:launch', (browser, launchOptions) => {
				// Chrome 브라우저 최적화
				if (browser.name === 'chrome' && browser.isHeadless) {
					launchOptions.args.push('--disable-gpu')
					launchOptions.args.push('--no-sandbox')
					launchOptions.args.push('--disable-dev-shm-usage')
				}

				return launchOptions
			})

			// spec 파일 필터링
			if (config.specPattern && typeof config.specPattern === 'string') {
				config.specPattern = [
					'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
					'!cypress/e2e/**/*.skip.cy.{js,jsx,ts,tsx}',
					'!cypress/e2e/examples/**/*',
				]
			}

			return config
		},
	},
	component: {
		devServer: {
			framework: 'next',
			bundler: 'webpack',
		},
		specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
	},
	env: {
		environment: process.env.NODE_ENV || 'development',
		apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:3000/api',

		enableAccessibilityTests: true,
		enableVisualRegression: false,

		// 테스트 데이터 관리
		testRunId: null, // 런타임에 생성됨

		enableDebugMode: process.env.CYPRESS_DEBUG === 'true',
	},
})
