export const volunteerActivitySelectors = {
	// 봉사활동 목록 페이지
	createButton: '[data-cy="create-volunteer-activity-button"]',
	volunteerActivityCard: '[data-cy="volunteer-activity-card"]',
	backButton: '[data-cy="back-button"]',

	// 봉사활동 생성 페이지
	createTitleInput: '[data-cy="volunteer-activity-form-title-input"]',
	createDescriptionInput: '[data-cy="volunteer-activity-form-content-input"]',
	createLocationInput: '[data-cy="volunteer-activity-form-location-input"]',
	createStartAtPopOver:
		'[data-cy="volunteer-activity-form-start-date-time-popover"]',
	createStartAtInput:
		'[data-cy="volunteer-activity-form-start-date-time-input"]',
	createEndAtPopOver:
		'[data-cy="volunteer-activity-form-end-date-time-popover"]',
	createEndAtInput: '[data-cy="volunteer-activity-form-end-date-time-input"]',
	createApplicationDeadlinePopOver:
		'[data-cy="volunteer-activity-form-application-deadline-popover"]',
	createStatusInput: '[data-cy="volunteer-activity-form-status-input"]',
	createStatusSelect: '[data-cy="volunteer-activity-form-status-select"]',
	createStatusTrigger: '[data-cy="volunteer-activity-form-status-trigger"]',
	createStatusContent: '[data-cy="volunteer-activity-form-status-content"]',
	createMaxParticipantsInput:
		'[data-cy="volunteer-activity-form-recruitment-count-input"]',
	createSubmitButton: '[data-cy="volunteer-activity-form-submit-button"]',
	createCancelButton: '[data-cy="volunteer-activity-form-cancel-button"]',

	// 봉사활동 수정 페이지
	editTitleInput: '[data-cy="volunteer-activity-form-title-input"]',
	editDescriptionInput: '[data-cy="volunteer-activity-form-content-input"]',
	editLocationInput: '[data-cy="volunteer-activity-form-location-input"]',
	editStartAtPopOver:
		'[data-cy="volunteer-activity-form-start-date-time-popover"]',
	editStartAtInput: '[data-cy="volunteer-activity-form-start-date-time-input"]',
	editEndAtPopOver: '[data-cy="volunteer-activity-form-end-date-time-popover"]',
	editEndAtInput: '[data-cy="volunteer-activity-form-end-date-time-input"]',
	editApplicationDeadlinePopOver:
		'[data-cy="volunteer-activity-form-application-deadline-popover"]',
	editMaxParticipantsInput:
		'[data-cy="volunteer-activity-form-recruitment-count-input"]',
	editSubmitButton: '[data-cy="volunteer-activity-form-submit-button"]',
	editCancelButton: '[data-cy="volunteer-activity-form-cancel-button"]',

	// 봉사활동 상세/액션
	editButton: '[data-cy="edit-button"]',
	deleteButton: '[data-cy="delete-button"]',
	confirmDeleteButton: '[data-cy="delete-volunteer-activity-button"]',
	cancelDeleteButton: '[data-cy="cancel-delete-volunteer-activity-button"]',

	// 공통
	cancelButton: '취소',
	editButtonText: '수정',
	deleteButtonText: '삭제',
	backButtonText: '뒤로가기',
} as const
