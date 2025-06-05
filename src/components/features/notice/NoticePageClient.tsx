'use client'

import React, { useCallback, useState } from 'react'
import NoticeList from '@/components/features/notice/NoticeList'
import NoticeModal from '@/components/features/notice/CreateNoticeModal'
import { ZodType } from '@/shared/types'
import { NoticeListEntitySchema } from '@/app/api/notice/schema'

interface NoticePageClientProps {
	notices: ZodType<typeof NoticeListEntitySchema>
	isAdmin: boolean
}

export default function NoticePageClient({
	notices,
	isAdmin,
}: NoticePageClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	return (
		<>
			{/* 공지사항 목록 */}
			<NoticeList notices={notices} />

			{/* 추가 정보 섹션 */}
			{notices.length > 0 && (
				<div className="mt-12 sm:mt-16">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-gray-600 text-center">
						<div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
							💡 알림 설정
						</div>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
							새로운 공지사항이 등록되면 이메일이나 카카오톡으로 알림을 받고
							싶으시다면,
							<br className="hidden sm:block" />
							관리자에게 문의해주세요.
						</p>
					</div>
				</div>
			)}

			{/* 오른쪽 하단 플로팅 +버튼 (관리자만) */}
			{isAdmin && (
				<button
					onClick={handleOpenModal}
					aria-label="공지사항 작성"
					className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
				>
					<span className="text-3xl">+</span>
				</button>
			)}

			{/* 공지사항 작성 모달 */}
			<NoticeModal open={isModalOpen} onClose={handleCloseModal} />
		</>
	)
}
