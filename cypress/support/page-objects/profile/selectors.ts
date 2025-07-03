export const profileSelectors = {
	// Profile Page
	profileCard: '[data-cy="profile-card"]',
	profileName: '[data-cy="profile-name"]',
	profileEmail: '[data-cy="profile-email"]',
	profileEditButton: '[data-cy="edit-profile-button"]',

	// Profile Form
	profileForm: '[data-cy="profile-form"]',
	profileNameInput: '[data-cy="profile-name-input"]',
	profileFormSubmit: '[data-cy="profile-form-submit"]',
	profileFormCancel: '[data-cy="profile-form-cancel"]',

	// User Profile Card
	userProfileCard: '[data-cy="user-profile-card"]',
	userProfileCardEmpty: '[data-cy="user-profile-card-empty"]',
	userProfilePhone: '[data-cy="user-profile-phone"]',
	userProfileEditButton: '[data-cy="edit-user-profile-button"]',
	userProfileCreateButton: '[data-cy="create-user-profile-button"]',
	userProfileProfessionComboBox:
		'[data-cy="user-profile-profession-combo-box"]',
	userProfileProfessionSelector: '[data-cy="user-profile-profession-selector"]',

	// User Profile Form
	userProfileForm: '[data-cy="user-profile-form"]',
	userProfilePhoneInput: '[data-cy="user-profile-phone-input"]',
	userProfileOrganizationInput: '[data-cy="user-profile-organization-input"]',
	userProfileFormSubmit: '[data-cy="user-profile-form-submit"]',
	userProfileFormCancel: '[data-cy="user-profile-form-cancel"]',

	// Setup Page
	setupPage: '[data-cy="profile-setup-page"]',
	setupNameInput: '[data-cy="setup-profile-name-input"]',
	setupPhoneInput: '[data-cy="setup-user-profile-phone-input"]',
	setupOrganizationInput: '[data-cy="setup-user-profile-organization-input"]',
	setupSubmitButton: '[data-cy="setup-profile-submit-button"]',

	// Common
	loadingSpinner: '.animate-spin',
	errorMessage: '[data-cy="error-message"]',
} as const
