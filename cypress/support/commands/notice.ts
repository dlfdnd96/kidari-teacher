import { NoticeData } from '../fixtures/notice/noticeTestData'
import {
	CreateNoticePage,
	DetailNoticePage,
	EditNoticePage,
	NoticePage,
} from '../page-objects'

Cypress.Commands.add('createNoticeViaUI', (notice: NoticeData) => {
	const noticePage = new NoticePage()
	const createPage = new CreateNoticePage()

	noticePage.clickCreateButton()

	createPage
		.verifyAtCreatePage()
		.verifyFormVisible()
		.fillNoticeForm(notice)
		.clickSubmit()

	noticePage.verifyAtListPage()
})

Cypress.Commands.add(
	'editNoticeViaUI',
	(originalNotice: NoticeData, updatedNotice: NoticeData) => {
		const noticePage = new NoticePage()
		const detailPage = new DetailNoticePage()
		const editPage = new EditNoticePage()

		noticePage.clickNoticeByTitle(originalNotice.title)

		detailPage.clickEdit()

		editPage
			.verifyAtEditPage()
			.verifyFormHasValues(originalNotice)
			.clearAndFillForm(updatedNotice)
			.clickSubmit()
			.verifyNotAtEditPage()

		detailPage.verifyNoticeContent(updatedNotice.title, updatedNotice.content)
	},
)

Cypress.Commands.add('deleteNoticeViaUI', (notice: NoticeData) => {
	const noticePage = new NoticePage()
	const detailPage = new DetailNoticePage()

	noticePage.clickNoticeByTitle(notice.title)

	detailPage.clickDelete().verifyDeleteConfirmationDialog().confirmDelete()

	noticePage.verifyAtListPage().verifyNoticeNotExists(notice.title)
})

Cypress.Commands.add('goToNoticeDetailByTitle', (title: string) => {
	const noticePage = new NoticePage()
	const detailPage = new DetailNoticePage()

	noticePage.clickNoticeByTitle(title)
	noticePage.verifyAtDetailPage()
	detailPage.verifyBackButtonVisible()
})

Cypress.Commands.add('setupNoticeTest', () => {
	cy.login('ADMIN')
	new NoticePage().visit()
})
