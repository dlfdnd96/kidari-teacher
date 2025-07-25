export const noticeSelectors = {
	// 공지사항 목록 페이지
	createButton: '[data-cy="create-notice-button"]',
	noticeCard: '[data-cy="notice-card"]',
	backButton: '[data-cy="back-button"]',

	// 공지사항 생성 페이지
	createForm: '[data-cy="notice-form"]',
	createTitleInput: '[data-cy="notice-form-title-input"]',
	createContentInput: '[data-cy="notice-form-content-input"]',
	createSubmitButton: '[data-cy="notice-form-submit-button"]',
	createCancelButton: '[data-cy="notice-form-cancel-button"]',

	// 공지사항 수정 페이지
	editTitleInput: '[data-cy="notice-form-title-input"]',
	editContentInput: '[data-cy="notice-form-content-input"]',
	editSubmitButton: '[data-cy="notice-form-submit-button"]',
	editCancelButton: '[data-cy="notice-form-cancel-button"]',

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
