'use client'

import { memo, useCallback } from 'react'
import { openExternalLink } from '@/lib/utils'
import { SITE_INFO } from '@/constants/homepage'
import { Star, Monitor, Mail, MessageCircle } from 'lucide-react'

const CTASection = memo(() => {
	const handleVisitCafe = useCallback(() => {
		openExternalLink(SITE_INFO.cafeUrl)
	}, [])

	return (
		<section className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8 text-center">
			<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-white relative overflow-hidden">
				{/* 배경 패턴 */}
				<div className="absolute inset-0 bg-white/10 bg-size-[30px_30px] opacity-10" />

				<div className="relative z-10">
					<div className="flex justify-center mb-4 sm:mb-6">
						<Star className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300" />
					</div>

					<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
						함께 해주세요!
					</h2>

					<p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
						고등학생들의 꿈을 응원하고 진로 선택에 도움을 주는 의미 있는
						<br className="hidden sm:block" />
						봉사활동에 참여해보세요.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
						<button
							onClick={handleVisitCafe}
							className="w-full sm:w-auto flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-xs px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
							aria-label="네이버 카페 방문하기"
						>
							<Monitor className="w-4 h-4 mr-2" />
							<div>
								<span className="block">카페 방문하기</span>
								<span className="block text-sm opacity-75">네이버 카페</span>
							</div>
						</button>
					</div>

					{/* 추가 연락 방법 안내 */}
					<div className="mt-6 text-sm opacity-80">
						<div className="flex items-center justify-center gap-4 flex-wrap">
							<div className="flex items-center">
								<MessageCircle className="w-4 h-4 mr-1" />
								<span>카카오톡 ID: </span>
								<span className="font-semibold">{SITE_INFO.kakaoId}</span>
							</div>
							<div className="flex items-center">
								<Mail className="w-4 h-4 mr-1" />
								<span>이메일: </span>
								<span className="font-semibold">{SITE_INFO.email}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
})

CTASection.displayName = 'CTASection'

export default CTASection
