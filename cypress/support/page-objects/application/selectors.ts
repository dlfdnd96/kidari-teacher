export const applicationSelectors = {
	// 신청 목록 페이지
	applicationTable: '[data-cy="my-applications-table"]',
	applicationRow: '[data-cy="application-row"]',
	statusCell: '[data-cy="application-status"]',
	titleCell: '[data-cy="application-title"]',
	professionCell: '[data-cy="application-profession"]',
	createdAtCell: '[data-cy="application-created-at"]',
	activityDateCell: '[data-cy="application-activity-date"]',
	locationCell: '[data-cy="application-location"]',
	actionCell: '[data-cy="application-action"]',

	// 액션 버튼
	cancelButton: '[data-cy="cancel-application-button"]',

	// 취소 확인 모달
	cancelConfirmDialog: '[role="dialog"]',
	confirmCancelButton: '[data-cy="confirm-cancel-button"]',
	cancelCancelButton: '[data-cy="cancel-cancel-button"]',

	// 페이지네이션
	pagination: '[data-cy="pagination"]',
	pageButton: '[data-cy="page-button"]',
	nextButton: '[data-cy="next-page"]',
	prevButton: '[data-cy="prev-page"]',

	// 상태 표시
	loadingIndicator: '[data-cy="loading-indicator"]',
	emptyState: '[data-cy="empty-applications"]',
	errorState: '[data-cy="error-state"]',
	retryButton: '[data-cy="retry-button"]',

	// 총 개수
	totalCount: '[data-cy="total-count"]',

	// 공통 텍스트 (fallback)
	cancelButtonText: '취소',
	confirmText: '신청 취소',
	cancelText: '취소',
	backButtonText: '뒤로가기',
} as const
