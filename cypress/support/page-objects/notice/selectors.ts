export const noticeSelectors = {
	// 공지사항 목록 페이지
	createButton: '[data-cy="create-notice-button"]',
	noticeCard: '[data-cy="notice-card"]',
	backButton: '[data-cy="back-button"]',

	// 공지사항 생성 페이지
	createForm: '[data-cy="create-notice-form-modal"]',
	createTitleInput: '[data-cy="create-notice-title-input"]',
	createContentInput: '[data-cy="create-notice-content-input"]',
	createSubmitButton: '[data-cy="create-submit-notice-button"]',
	createCancelButton: '[data-cy="create-cancel-button"]',

	// 공지사항 수정 페이지
	editTitleInput: '[data-cy="edit-notice-title-input"]',
	editContentInput: '[data-cy="edit-notice-content-input"]',
	editSubmitButton: '[data-cy="edit-notice-submit-button"]',
	editCancelButton: '[data-cy="edit-cancel-button"]',

	// 공지사항 상세/액션
	editButton: '[data-cy="edit-button"]',
	deleteButton: '[data-cy="delete-button"]',
	confirmDeleteButton: '[data-cy="delete-notice-button"]',
	cancelDeleteButton: '[data-cy="cancel-delete-notice-button"]',

	// 공통
	cancelButton: '취소',
	editButtonText: '수정',
	deleteButtonText: '삭제',
	backButtonText: '뒤로가기',
} as const
