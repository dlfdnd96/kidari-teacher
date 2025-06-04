import { z } from 'zod/v4'

export const NoticeFormSchema = z.object({
	title: z.string().min(1, '제목을 입력해주세요.'),
	content: z.string().min(1, '내용을 입력해주세요.'),
})

export const NoticeEditFormSchema = z.object({
	title: z.string().min(1, '제목을 입력해주세요.'),
	content: z.string().min(1, '내용을 입력해주세요.'),
})
