'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import NoticeEditForm from '@/components/features/notice/NoticeEditForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { trpc } from '@/components/providers/TrpcProvider'
import { NoticeEditPageClientProps } from '@/types/notice'

const NoticeEditPageClient = memo(({ noticeId }: NoticeEditPageClientProps) => {
	const router = useRouter()

	const {
		data: notice,
		isLoading,
		isError,
	} = trpc.notice.getNotice.useQuery({ id: noticeId })

	const handleCancel = useCallback(() => {
		router.push(`/notice/${noticeId}`)
	}, [router, noticeId])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
				</div>
			</div>
		)
	}

	if (isError || !notice) {
		return (
			<div className="min-h-screen">
				{/* 상단 네비게이션 */}
				<div>
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
						<div className="flex items-center justify-between h-14">
							<div className="py-4">
								<button
									onClick={() => router.push('/notice')}
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
								>
									<ArrowLeft className="w-4 h-4" />
									<span className="text-sm font-medium">뒤로가기</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* 메인 컨텐츠 */}
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
					<div className="p-6 sm:p-8">
						<div className="text-center py-12">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
								공지사항을 찾을 수 없습니다
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								요청하신 공지사항이 존재하지 않거나 삭제되었습니다.
							</p>
							<Button
								onClick={() => router.push('/notice')}
								className="flex items-center gap-2 cursor-pointer"
							>
								<ArrowLeft className="w-4 h-4" />
								목록으로 돌아가기
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
				<NoticeEditForm
					id={notice.id}
					initialTitle={notice.title}
					initialContent={notice.content}
					onCancel={handleCancel}
				/>
			</div>
		</div>
	)
})

NoticeEditPageClient.displayName = 'NoticeEditPageClient'

export default NoticeEditPageClient
