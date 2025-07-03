export const volunteerActivitySelectors = {
	// 봉사활동 목록 페이지
	createButton: '[data-cy="create-volunteer-activity-button"]',
	volunteerActivityCard: '[data-cy="volunteer-activity-card"]',
	backButton: '[data-cy="back-button"]',

	// 봉사활동 생성 페이지
	createTitleInput: '[data-cy="create-volunteer-activity-title-input"]',
	createDescriptionInput: '[data-cy="create-volunteer-activity-content-input"]',
	createLocationInput: '[data-cy="create-volunteer-activity-location-input"]',
	createStartAtPopOver:
		'[data-cy="create-volunteer-activity-start-date-time-popover"]',
	createStartAtInput:
		'[data-cy="create-volunteer-activity-start-date-time-input"]',
	createEndAtPopOver:
		'[data-cy="create-volunteer-activity-end-date-time-popover"]',
	createEndAtInput: '[data-cy="create-volunteer-activity-end-date-time-input"]',
	createApplicationDeadlinePopOver:
		'[data-cy="create-volunteer-activity-application-deadline-popover"]',
	createStatusInput: '[data-cy="create-volunteer-activity-status-input"]',
	createStatusSelect: '[data-cy="create-volunteer-activity-status-select"]',
	createStatusTrigger: '[data-cy="create-volunteer-activity-status-trigger"]',
	createStatusContent: '[data-cy="create-volunteer-activity-status-content"]',
	createMaxParticipantsInput:
		'[data-cy="create-volunteer-activity-recruitment-count-input"]',
	createSubmitButton: '[data-cy="create-volunteer-activity-button"]',
	createCancelButton: '[data-cy="create-cancel-button"]',

	// 봉사활동 수정 페이지
	editTitleInput: '[data-cy="edit-volunteer-activity-title-input"]',
	editDescriptionInput: '[data-cy="edit-volunteer-activity-content-input"]',
	editLocationInput: '[data-cy="edit-volunteer-activity-location-input"]',
	editStartAtPopOver:
		'[data-cy="edit-volunteer-activity-start-date-time-popover"]',
	editStartAtInput: '[data-cy="edit-volunteer-activity-start-date-time-input"]',
	editEndAtPopOver: '[data-cy="edit-volunteer-activity-end-date-time-popover"]',
	editEndAtInput: '[data-cy="edit-volunteer-activity-end-date-time-input"]',
	editApplicationDeadlinePopOver:
		'[data-cy="edit-volunteer-activity-application-deadline-popover"]',
	editMaxParticipantsInput:
		'[data-cy="edit-volunteer-activity-recruitment-count-input"]',
	editSubmitButton: '[data-cy="edit-volunteer-activity-submit-button"]',
	editCancelButton: '[data-cy="edit-cancel-button"]',

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
