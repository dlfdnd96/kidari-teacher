'use client'

import { memo, useCallback } from 'react'
import { openExternalLink, formatPhoneNumber } from '@/lib/utils'
import { SITE_INFO } from '@/constants/homepage'

const CTASection = memo(() => {
	// 전화 걸기 핸들러
	const handlePhoneCall = useCallback(() => {
		const phoneNumber = SITE_INFO.phone.replace(/-/g, '')
		window.location.href = `tel:${phoneNumber}`
	}, [])

	// 카페 방문 핸들러
	const handleVisitCafe = useCallback(() => {
		openExternalLink(SITE_INFO.cafeUrl)
	}, [])

	return (
		<section className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8 text-center">
			<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-white relative overflow-hidden">
				{/* 배경 패턴 */}
				<div className="absolute inset-0 bg-white/10 bg-[size:30px_30px] opacity-10" />

				<div className="relative z-10">
					<div
						className="text-3xl sm:text-5xl mb-4 sm:mb-6"
						role="img"
						aria-label="별"
					>
						🌟
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
							onClick={handlePhoneCall}
							className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
							aria-label={`전화로 연락하기: ${SITE_INFO.phone}`}
						>
							📞 바로 연락하기
							<span className="block text-sm opacity-75 mt-1">
								{formatPhoneNumber(SITE_INFO.phone)}
							</span>
						</button>

						<button
							onClick={handleVisitCafe}
							className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
							aria-label="네이버 카페 방문하기"
						>
							💻 카페 방문하기
							<span className="block text-sm opacity-75 mt-1">네이버 카페</span>
						</button>
					</div>

					{/* 추가 연락 방법 안내 */}
					<div className="mt-6 text-sm opacity-80">
						<p>
							카카오톡 ID:{' '}
							<span className="font-semibold">{SITE_INFO.kakaoId}</span> |
							이메일: <span className="font-semibold">{SITE_INFO.email}</span>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
})

CTASection.displayName = 'CTASection'

export default CTASection
