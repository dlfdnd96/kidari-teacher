import { memo } from 'react'
import { KakaoTalkIcon, NaverCafeIcon } from '@/components/icons'
import { CONTACT_METHODS, PROCESS_STEPS } from '@/constants/homepage'

const ContactSection = memo(() => {
	return (
		<section className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					연락처 및 참여 방법
				</h2>
				<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
				{/* 모임장 연락처 */}
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
						{CONTACT_METHODS.map((contact, index) => {
							const ContactContent = () => (
								<>
									<span
										className="mr-2 sm:mr-3 flex-shrink-0"
										style={{
											fontSize: '1.2rem',
											color: contact.type === 'phone' ? '#d32f2f' : 'inherit',
										}}
									>
										{contact.type === 'kakao' ? (
											<KakaoTalkIcon />
										) : (
											contact.icon
										)}
									</span>
									<span className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg truncate">
										{contact.value}
									</span>
								</>
							)

							return contact.href ? (
								<a
									key={index}
									href={contact.href}
									className="flex items-center p-2 sm:p-3 bg-white/20 dark:bg-gray-700 rounded-full hover:bg-white/30 transition-colors duration-300 cursor-pointer"
									style={{ textDecoration: 'none' }}
								>
									<ContactContent />
								</a>
							) : (
								<div
									key={index}
									className="flex items-center p-2 sm:p-3 bg-white/20 dark:bg-gray-700 rounded-full"
								>
									<ContactContent />
								</div>
							)
						})}
					</div>
				</div>

				{/* 참여 방법 */}
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
				</div>
			</div>

			{/* 봉사 활동 절차 안내 */}
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
				<div className="flex items-center mb-6 sm:mb-8">
					<div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
						<span className="text-xl sm:text-2xl text-white">📋</span>
					</div>
					<h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
						봉사 활동 진행 절차
					</h3>
				</div>

				<div className="space-y-6 sm:space-y-8">
					{PROCESS_STEPS.map((step, index) => (
						<div key={index} className="flex items-center">
							<div
								className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-4 sm:mr-6 shadow-lg`}
							>
								{step.step}
							</div>
							<div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
								<h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base sm:text-lg">
									{step.title}
								</h4>
								<div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
									<p>{step.description}</p>

									{step.danger && (
										<div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-3 rounded-xl border-l-4 border-orange-400">
											<p className="text-sm text-orange-700 dark:text-orange-300">
												<strong>{step.danger.attention}:</strong>{' '}
												{step.danger.title}
											</p>
											{step.danger.items && (
												<ul className="mt-2 text-xs space-y-1">
													{step.danger.items.map((item, itemIndex) => (
														<li key={itemIndex}>{item}</li>
													))}
												</ul>
											)}
										</div>
									)}

									{step.warning && (
										<div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-xl border-l-4 border-yellow-400">
											<p className="text-sm text-yellow-700 dark:text-yellow-300">
												<strong>{step.warning.attention}:</strong>{' '}
												{step.warning.title}
											</p>
											{step.warning.items && (
												<ul className="mt-2 text-xs space-y-1">
													{step.warning.items.map((item, itemIndex) => (
														<li key={itemIndex}>{item}</li>
													))}
												</ul>
											)}
										</div>
									)}

									{step.note && (
										<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl border-l-4 border-blue-400">
											<h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
												{step.note.title}
											</h5>
											<ul className="text-sm space-y-1">
												{step.note.items.map((item, itemIndex) => (
													<li key={itemIndex}>{item}</li>
												))}
											</ul>
										</div>
									)}

									{index === 1 && (
										<p>
											봉사 신청이 마무리되면 실제 봉사 예정자들을 위한 별도
											단톡방이 개설되어 상세 내용을 공지합니다.
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
})

ContactSection.displayName = 'ContactSection'

export default ContactSection
