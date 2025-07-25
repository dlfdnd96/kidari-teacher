import {
	ProfileData,
	UserProfileData,
	ProfileTestDataFactory,
} from '../../support/fixtures/profile/profileTestData'
import { errorSelectors } from '../../support/page-objects/error/selectors'
import {
	ProfilePage,
	ProfileFormPage,
	UserProfileFormPage,
	SetupPage,
} from '../../support/page-objects'

describe('프로필 CRUD 테스트', () => {
	let updatedTestProfile: ProfileData
	let testUserProfile: UserProfileData
	let updatedTestUserProfile: UserProfileData
	let profilePage: ProfilePage
	let profileFormPage: ProfileFormPage
	let userProfileFormPage: UserProfileFormPage
	let setupPage: SetupPage

	beforeEach(() => {
		updatedTestProfile = ProfileTestDataFactory.createUpdatedTestProfile()
		testUserProfile = ProfileTestDataFactory.createTestUserProfile()
		updatedTestUserProfile =
			ProfileTestDataFactory.createUpdatedTestUserProfile()

		// Page Object 인스턴스 생성
		profilePage = new ProfilePage()
		profileFormPage = new ProfileFormPage()
		userProfileFormPage = new UserProfileFormPage()
		setupPage = new SetupPage()

		cy.setupProfileTest()
	})

	afterEach(() => {
		cy.cleanupTestData('user-profiles')
	})

	after(() => {
		cy.cleanupTestData('test-data')
	})

	describe('프로필 조회', () => {
		it('프로필 정보를 조회할 수 있다', () => {
			profilePage
				.verifyAtProfilePage()
				.verifyProfileCardVisible()
				.verifyPageLoaded()
		})

		it('사용자 추가 프로필이 없을 때 빈 상태를 표시한다', () => {
			cy.cleanupTestData('user-profiles')
			cy.reload()

			profilePage.verifyUserProfileCardEmpty()
		})
	})

	describe('프로필 수정', () => {
		it('기본 프로필 정보를 수정할 수 있다', () => {
			profilePage.clickEditProfile()

			profileFormPage
				.verifyAtFormPage()
				.verifyFormVisible()
				.fillNameOnly(updatedTestProfile.name)
				.clickSubmit()
				.verifyNotAtFormPage()

			profilePage
				.verifyAtProfilePage()
				.verifyProfileName(updatedTestProfile.name)
		})

		it('필수 입력 항목이 비어있으면 수정할 수 없다', () => {
			profilePage.clickEditProfile()

			profileFormPage
				.verifyAtFormPage()
				.clearName()
				.clickSubmit()
				.verifyStillAtFormPage()
				.clickCancel()

			profilePage.verifyAtProfilePage()
		})
	})

	describe('사용자 추가 프로필 생성', () => {
		it('새로운 사용자 프로필을 생성할 수 있다', () => {
			cy.cleanupTestData('user-profiles')
			cy.reload()

			cy.createUserProfileViaUI(testUserProfile)

			profilePage
				.verifyUserProfileCard()
				.verifyUserProfileInfo(
					testUserProfile.phone,
					testUserProfile.organization,
				)
		})

		it('필수 입력 항목이 비어있으면 생성할 수 없다', () => {
			cy.cleanupTestData('user-profiles')
			cy.reload()

			profilePage.clickCreateUserProfile()

			userProfileFormPage
				.verifyAtFormPage()
				.clearPhone()
				.clickSubmit()
				.verifyStillAtFormPage()
				.clickCancel()

			profilePage.verifyUserProfileCardEmpty()
		})
	})

	// FIXME: 테스트 실패 원인 분석이 필요함
	describe.skip('사용자 추가 프로필 수정', () => {
		beforeEach(() => {
			cy.editUserProfileViaUI(testUserProfile)
		})

		it('기존 사용자 프로필을 수정할 수 있다', () => {
			cy.editUserProfileViaUI(updatedTestUserProfile)

			profilePage.verifyUserProfileInfo(
				updatedTestUserProfile.phone,
				updatedTestUserProfile.organization,
			)
		})

		it('필수 입력 항목이 비어있으면 수정할 수 없다', () => {
			profilePage.clickEditUserProfile()

			userProfileFormPage
				.verifyAtFormPage()
				.verifyFormHasValues(testUserProfile)
				.clearPhone()
				.clickSubmit()
				.verifyStillAtFormPage()
				.clickCancel()
				.verifyNotAtFormPage()

			profilePage.verifyUserProfileInfo(
				testUserProfile.phone,
				testUserProfile.organization,
			)
		})
	})

	describe('프로필 설정', () => {
		it('새 사용자가 프로필을 설정할 수 있다', () => {
			cy.cleanupTestData('user-profiles')
			cy.reload()

			const setupProfile = ProfileTestDataFactory.createTestSetupProfile()

			cy.goToProfileSetup()
			cy.setupProfileViaUI(setupProfile)
		})

		it('필수 입력 항목이 비어있으면 설정을 완료할 수 없다', () => {
			cy.goToProfileSetup()

			setupPage
				.verifyAtSetupPage()
				.verifyFormVisible()
				.clearName()
				.clearPhone()
				.clickSubmit()
				.verifyStillAtSetupPage()
		})
	})

	describe('에러 상황 처리', () => {
		it('네트워크 에러 시 적절한 에러 메시지를 표시한다', () => {
			cy.intercept('POST', '/api/trpc/user.updateUser*', {
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
			}).as('updateProfileError')

			profilePage.clickEditProfile()

			profileFormPage
				.verifyAtFormPage()
				.fillProfileForm(updatedTestProfile)
				.clickSubmit()

			cy.wait('@updateProfileError')

			cy.get(errorSelectors.errorModal).should('be.visible')
			cy.get(errorSelectors.errorModalTitle).should(
				'contain',
				'처리 중 오류가 발생했습니다',
			)
		})
	})
})
