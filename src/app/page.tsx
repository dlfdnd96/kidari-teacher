import React from 'react'
import { NaverCafeIcon } from '@/components/icons'

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-5"></div>

			{/* 키다리 선생님 소개 섹션 - Hero Section */}
			<section className="relative max-w-4xl mx-auto pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-8 text-center">
				<div className="mb-8">
					<div className="inline-flex items-center justify-center w-80 sm:w-120 h-60 sm:h-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl mb-6 shadow-xl p-4 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
						<img
							src="/images/main.png"
							alt="키다리 선생님 대표 이미지"
							className="w-full h-full object-contain"
						/>
					</div>
					<h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
						키다리 선생님
					</h1>
					<div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-md mb-3 sm:mb-4">
						<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
							전문직 봉사동아리
						</span>
					</div>
					<p className="text-lg sm:text-xl mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 font-medium px-2">
						고등학생들에게 직업 탐방 강연 - 봉사활동으로 진행
					</p>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
						진로, 적성, 전문직의 삶에 대해 전달하여 진로 선택에 도움을 주기 위한
						<br className="hidden sm:block" />
						사회인 봉사 동아리
					</p>
				</div>

				{/* 통계 카드들 - 모바일 최적화 */}
				<div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 sm:mt-12">
					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 w-full sm:w-40 transition-all duration-300 hover:-translate-y-2 border border-blue-100 dark:border-gray-700">
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
							30+
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							참여 학교 수
						</div>
						<div className="text-xl sm:text-2xl mt-2">🏫</div>
					</div>
					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 w-full sm:w-40 transition-all duration-300 hover:-translate-y-2 border border-purple-100 dark:border-gray-700">
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mb-2">
							100+
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							전문직 봉사자 수
						</div>
						<div className="text-xl sm:text-2xl mt-2">👥</div>
					</div>
					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 w-full sm:w-40 transition-all duration-300 hover:-translate-y-2 border border-indigo-100 dark:border-gray-700">
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent mb-2">
							80+
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							누적 활동 횟수
						</div>
						<div className="text-xl sm:text-2xl mt-2">📊</div>
					</div>
				</div>
			</section>

			{/* 전문직 구성원 소개 - 모바일 최적화 */}
			<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						전문직 구성원
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
				</div>

				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<div className="text-center group">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<span className="text-xl sm:text-2xl text-white">⚖️</span>
							</div>
							<div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
								법률/의료
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								변호사, 의사, 치과의사, 한의사, 약사
							</div>
						</div>

						<div className="text-center group">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<span className="text-xl sm:text-2xl text-white">💰</span>
							</div>
							<div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
								금융/회계
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								회계사, 세무사, 보험계리사, CFA
							</div>
						</div>

						<div className="text-center group">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<span className="text-xl sm:text-2xl text-white">⚙️</span>
							</div>
							<div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
								기술/공학
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								IT전문가, 기계공학 박사, 생명공학 박사
							</div>
						</div>

						<div className="text-center group">
							<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<span className="text-xl sm:text-2xl text-white">📋</span>
							</div>
							<div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
								기타 전문직
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								변리사, 감정평가사, 행시 출신 사무관, 노무사
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 학교 피드백 하이라이트 - 모바일 최적화 */}
			<section className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						학교 측 반응
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
				</div>

				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
					<div className="text-4xl sm:text-6xl mb-4 sm:mb-6 text-center">
						💬
					</div>
					<div className="space-y-4 sm:space-y-6">
						<div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 rounded-2xl border-l-4 border-blue-500">
							<div className="text-xl sm:text-2xl absolute -top-1 sm:-top-2 -left-1 sm:-left-2 text-blue-500">
								"
							</div>
							<p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 italic leading-relaxed">
								아이들이 적극적으로 질문하는 경우가 드문데, 직업인과의 대화때는
								아이들이 질문도 많이하고, 대화기록지보면 내용도 풍부하게
								작성하는 편이라 만족도가 높습니다 😊
							</p>
						</div>

						<div className="relative bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 rounded-2xl border-l-4 border-purple-500">
							<div className="text-xl sm:text-2xl absolute -top-1 sm:-top-2 -left-1 sm:-left-2 text-purple-500">
								"
							</div>
							<p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 italic leading-relaxed">
								나이 차이가 많이 나지 않으신 분들이 오시다보니 학생들이
								궁금해하는 진학방법, 사회초년생으로서의 직업 만족도 등을 편히
								질문할 수 있어서 좋은 것 같습니다.
							</p>
						</div>

						<div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 rounded-2xl border-l-4 border-indigo-500">
							<div className="text-xl sm:text-2xl absolute -top-1 sm:-top-2 -left-1 sm:-left-2 text-indigo-500">
								"
							</div>
							<p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 italic leading-relaxed">
								같은 말이라도 선생님들이 이야기하면 잘 듣지 않는데, 아무래도
								희망하는 직업을 가지신 분들이 이야기해 주시니 학생들이 더
								느끼는게 많은 것 같아요^^
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 최신 활동 현황 - 모바일 최적화 */}
			<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						2024년 최신 활동 현황
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
					{/* 최근 활동 리스트 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
						<div className="flex items-center mb-4 sm:mb-6">
							<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
								<span className="text-lg sm:text-xl text-white">📅</span>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
								최근 활동 (2024년)
							</h3>
						</div>
						<ul className="space-y-2 sm:space-y-3">
							{[
								{
									date: '2024-12-27',
									school: '자양고',
									location: '서울특별시 광진구',
								},
								{
									date: '2024-12-22',
									school: '연탄봉사',
									location: '서울특별시 강남구 구룡마을',
								},
								{
									date: '2024-09-07',
									school: '대원여고',
									location: '서울특별시 광진구',
								},
								{
									date: '2024-08-17',
									school: '구현고',
									location: '서울특별시 구로구',
								},
								{
									date: '2024-07-13',
									school: '풍생고',
									location: '경기도 성남시',
								},
								{
									date: '2024-07-12',
									school: '보성고',
									location: '서울특별시 송파구',
								},
							].map((activity, index) => (
								<li
									key={index}
									className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
								>
									<div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
									<div className="flex-1 min-w-0">
										<div className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
											{activity.date}: {activity.school}
										</div>
										<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
											({activity.location})
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* 봉사 활동 시간 */}
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
						<div className="flex items-center mb-4 sm:mb-6">
							<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
								<span className="text-lg sm:text-xl text-white">⏰</span>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
								봉사 가능일
							</h3>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
								<div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
									<span className="text-white font-bold text-sm sm:text-base">
										✓
									</span>
								</div>
								<div>
									<div className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
										금요일 저녁 7시
									</div>
								</div>
							</div>
							<div className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
								<div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
									<span className="text-white font-bold text-sm sm:text-base">
										✓
									</span>
								</div>
								<div>
									<div className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
										토요일 오전 10시
									</div>
								</div>
							</div>
						</div>
						<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-400">
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								사회인 봉사 동아리임을 고려하여, 직장인 분들과 학교측의 가능한
								봉사일
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 활동의 임팩트 섹션 - 독립적으로 분리 */}
			<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						활동의 임팩트
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
						실제 수치로 보는 키다리 선생님의 성과와 학생들의 반응
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
						<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<span className="text-xl sm:text-2xl text-white">😊</span>
						</div>
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
							95%
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							학생 만족도
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							참여 학생 설문조사 결과
						</div>
					</div>

					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
						<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<span className="text-xl sm:text-2xl text-white">👥</span>
						</div>
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
							2,500+
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							참여 학생 수
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							누적 강연 참석 학생
						</div>
					</div>

					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
						<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<span className="text-xl sm:text-2xl text-white">🎯</span>
						</div>
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
							85%
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							진로 도움도
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							진로 선택에 도움됨
						</div>
					</div>

					<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
						<div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<span className="text-xl sm:text-2xl text-white">⭐</span>
						</div>
						<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
							4.8/5
						</div>
						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							학교 평가
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							참여 학교 만족도
						</div>
					</div>
				</div>

				{/* 추가 설명 */}
				<div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-gray-600">
					<div className="text-center">
						<div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
							💪 지속적인 성장과 발전
						</div>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
							2022년 시작된 키다리 선생님은 매년 더 많은 학교와 학생들에게
							양질의 진로 교육을 제공하고 있습니다. 참여하신 전문직 분들의
							진심어린 조언과 학생들의 열정적인 참여가 만들어낸 의미있는
							성과입니다.
						</p>
					</div>
				</div>
			</section>

			{/* 연락처 및 참여 방법 - 모바일 최적화 */}
			<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						연락처 및 참여 방법
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center mb-4 sm:mb-6">
							<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
								<span className="text-lg sm:text-xl text-white">👤</span>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
								모임장 연락처
							</h3>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-center p-2 sm:p-3 bg-white/20 dark:bg-gray-700 rounded-full">
								<span
									className="mr-2 sm:mr-3 flex-shrink-0"
									style={{ fontSize: '1.2rem', color: '#d32f2f' }}
								>
									📞
								</span>
								<span className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg">
									010-2210-6387
								</span>
							</div>
							<a
								href="mailto:academi9@naver.com"
								className="flex items-center p-2 sm:p-3 bg-white/20 dark:bg-gray-700 rounded-full hover:bg-white/30 transition-colors duration-300 cursor-pointer"
								style={{ textDecoration: 'none' }}
							>
								<span
									className="mr-2 sm:mr-3 flex-shrink-0"
									style={{ fontSize: '1.2rem' }}
								>
									💌
								</span>
								<span className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg truncate">
									academi9@naver.com
								</span>
							</a>
						</div>
					</div>

					<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
						<div className="flex items-center mb-4 sm:mb-6">
							<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
								<span className="text-lg sm:text-xl text-white">🤝</span>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
								참여 방법
							</h3>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
								<div className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">
									카페:
								</div>
								<div className="text-blue-600 dark:text-blue-400">
									<a
										href="https://cafe.naver.com/provolunteer"
										target="_blank"
										rel="noopener noreferrer"
									>
										<NaverCafeIcon size={20} />
									</a>
								</div>
							</div>
							<div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
								<div className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">
									소모임:
								</div>
								<div className="text-purple-600 dark:text-purple-400 text-sm sm:text-base">
									소모임 어플 키다리 모임 검색
								</div>
							</div>
						</div>
						<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-400">
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								학교 측과 협의 후 봉사일자 확정하여 진행
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 활동 사진 갤러리 - 크게 개선 */}
			<section className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						활동 사진
					</h2>
					<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
						실제 강연 현장에서 학생들과 소통하는 모습을 담았습니다
					</p>
				</div>

				{/* 메인 이미지 (큰 사이즈) */}
				<div className="mb-6 sm:mb-8">
					<div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
						<div className="aspect-[16/9] sm:aspect-[21/9] relative overflow-hidden">
							<img
								src="/images/lecture_001.png"
								alt="키다리 선생님 메인 활동 현장"
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<h3 className="text-lg sm:text-xl font-bold mb-1">
									직업 탐방 강연 현장
								</h3>
								<p className="text-sm sm:text-base opacity-90">
									고등학생들과 진로에 대해 진솔한 대화를 나누는 모습
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 서브 이미지들 (중간 사이즈) */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					<div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
						<div className="aspect-[4/3] relative overflow-hidden">
							<img
								src="/images/lecture_002.png"
								alt="학생들과의 질의응답 시간"
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<h4 className="font-bold text-sm sm:text-base mb-1">
									질의응답 시간
								</h4>
								<p className="text-xs sm:text-sm opacity-90">
									학생들의 적극적인 참여와 질문
								</p>
							</div>
						</div>
						<div className="p-4 sm:p-6">
							<div className="flex items-center mb-2">
								<div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
									<span className="text-white text-sm">💬</span>
								</div>
								<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
									활발한 소통
								</span>
							</div>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								학생들이 직접 질문하며 진로에 대한 궁금증을 해결하는 시간
							</p>
						</div>
					</div>

					<div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
						<div className="aspect-[4/3] relative overflow-hidden">
							<img
								src="/images/lecture_003.png"
								alt="전문직 소개 및 경험 공유"
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<h4 className="font-bold text-sm sm:text-base mb-1">
									전문직 소개
								</h4>
								<p className="text-xs sm:text-sm opacity-90">
									실무 경험과 노하우 전달
								</p>
							</div>
						</div>
						<div className="p-4 sm:p-6">
							<div className="flex items-center mb-2">
								<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
									<span className="text-white text-sm">🎯</span>
								</div>
								<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
									경험 공유
								</span>
							</div>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								현장에서 쌓은 생생한 경험과 진로 선택의 노하우를 전달
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section - 모바일 최적화 */}
			<section className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8 text-center">
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-white relative overflow-hidden">
					<div className="absolute inset-0 bg-white/10 bg-[size:30px_30px] opacity-10"></div>
					<div className="relative z-10">
						<div className="text-3xl sm:text-5xl mb-4 sm:mb-6">🌟</div>
						<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
							함께 해주세요!
						</h2>
						<p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
							고등학생들의 꿈을 응원하고 진로 선택에 도움을 주는 의미 있는
							<br className="hidden sm:block" />
							봉사활동에 참여해보세요.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
							<a
								href="tel:010-2210-6387"
								className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
							>
								📞 바로 연락하기
							</a>
							<a
								href="https://cafe.naver.com/provolunteer"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
							>
								💻 카페 방문하기
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer - 모바일 최적화 */}
			<footer className="max-w-5xl mx-auto px-4 sm:px-8 pb-8 sm:pb-12">
				<div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
					<div className="text-xl sm:text-2xl mb-3 sm:mb-4">🎓</div>
					<div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
						키다리 선생님 © 2025. All rights reserved.
					</div>
					<div className="text-gray-500 dark:text-gray-500 text-xs mt-2">
						고등학생들의 밝은 미래를 위해 함께 합니다.
					</div>
				</div>
			</footer>
		</div>
	)
}
