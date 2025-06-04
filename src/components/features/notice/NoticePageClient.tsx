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
			{/* 관리자 전용 작성 버튼 */}
			{isAdmin && (
				<div className="mb-8 sm:mb-12 text-center">
					<div className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
						<span className="mr-2 text-lg" role="img" aria-label="관리자">
							👨‍💼
						</span>
						<span className="font-semibold text-sm sm:text-base">
							관리자 전용
						</span>
					</div>

					<button
						onClick={handleOpenModal}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform"
					>
						<span className="mr-3 text-xl" role="img" aria-label="작성">
							✍️
						</span>
						새 공지사항 작성하기
					</button>
				</div>
			)}

			{/* 공지사항 목록 */}
			<div>
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						📢 최신 공지사항
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
						중요한 소식과 업데이트를 놓치지 마세요
					</p>
				</div>

				<NoticeList notices={notices} />
			</div>

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

			{/* 공지사항 작성 모달 */}
			<NoticeModal open={isModalOpen} onClose={handleCloseModal} />
		</>
	)
}
