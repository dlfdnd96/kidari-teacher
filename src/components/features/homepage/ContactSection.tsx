'use client'

import { memo, useCallback } from 'react'
import { KakaoTalkIcon, NaverCafeIcon } from '@/components/icons'
import { openExternalLink } from '@/lib/utils'
import { CONTACT_METHODS, PROCESS_STEPS, SITE_INFO } from '@/constants/homepage'
import { z } from 'zod/v4-mini'
import {
	User,
	Handshake,
	Clipboard,
	Mail,
	AlertTriangle,
	AlertCircle,
	Info,
} from 'lucide-react'

const ContactSection = memo(() => {
	const handleExternalLink = useCallback((url: string) => {
		openExternalLink(url)
	}, [])

	const renderContactMethod = useCallback(
		(contact: (typeof CONTACT_METHODS)[0], index: number) => {
			const displayValue = contact.value

			if (process.env.NODE_ENV === 'development' && contact.type === 'email') {
				const email = z.email().safeParse(contact.value)
				if (!email.success) {
					console.warn(`Invalid email format: ${contact.value}`)
				}
			}

			const ContactContent = () => (
				<>
					<span className="mr-2 sm:mr-3 shrink-0">
						{contact.type === 'kakao' ? (
							<KakaoTalkIcon />
						) : contact.type === 'email' ? (
							<Mail className="w-5 h-5 text-current" />
						) : (
							contact.icon
						)}
					</span>
					<span className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg truncate">
						{displayValue}
					</span>
				</>
			)

			return contact.href ? (
				<a
					key={index}
					href={contact.href}
					className="flex items-center p-2 sm:p-3 bg-white/20 dark:bg-gray-700 rounded-full hover:bg-white/30 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					style={{ textDecoration: 'none' }}
					aria-label={`${contact.label}: ${displayValue}`}
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
		},
		[],
	)

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
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
					<div className="flex items-center mb-4 sm:mb-6">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
							<User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
							모임장 연락처
						</h3>
					</div>

					<div className="space-y-3 sm:space-y-4">
						{CONTACT_METHODS.map(renderContactMethod)}
					</div>
				</div>

				{/* 참여 방법 */}
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
					<div className="flex items-center mb-4 sm:mb-6">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-3 sm:mr-4">
							<Handshake className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
							참여 방법
						</h3>
					</div>

					<div className="space-y-3 sm:space-y-4">
						<div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
							<div className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">
								네이버 카페:
							</div>
							<button
								onClick={() => handleExternalLink(SITE_INFO.cafeUrl)}
								className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
								aria-label="네이버 카페로 이동"
							>
								<NaverCafeIcon size={20} />
							</button>
						</div>
						<div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
							<div className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">
								소모임:
							</div>
							<div className="text-purple-600 dark:text-purple-400 text-sm sm:text-base">
								{`소모임 어플에서 "키다리선생님" 검색`}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 봉사 활동 절차 안내 */}
			<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
				<div className="flex items-center mb-6 sm:mb-8">
					<div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
						<Clipboard className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
					</div>
					<h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
						봉사 활동 진행 절차
					</h3>
				</div>

				<div className="space-y-6 sm:space-y-8">
					{PROCESS_STEPS.map((step) => (
						<div key={step.step} className="flex items-center">
							<div
								className={`shrink-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-4 sm:mr-6 shadow-lg`}
							>
								{step.step}
							</div>
							<div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
								<h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base sm:text-lg">
									{step.title}
								</h4>
								<div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
									<p>{step.description}</p>

									{step.danger && (
										<div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-3 rounded-xl border-l-4 border-orange-400">
											<div className="flex items-start">
												<AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 shrink-0" />
												<div>
													<p className="text-sm text-orange-700 dark:text-orange-300">
														<strong>{step.danger.attention}: </strong>
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
											</div>
										</div>
									)}

									{step.warning && (
										<div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-xl border-l-4 border-yellow-400">
											<div className="flex items-start">
												<AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 shrink-0" />
												<div>
													<p className="text-sm text-yellow-700 dark:text-yellow-300">
														<strong>{step.warning.attention}: </strong>
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
											</div>
										</div>
									)}

									{step.additionalDescription && (
										<p>{step.additionalDescription}</p>
									)}

									{step.note && (
										<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl border-l-4 border-blue-400">
											<div className="flex items-start">
												<Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 shrink-0" />
												<div>
													<h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
														{step.note.title}
													</h5>
													<ul className="text-sm space-y-1">
														{step.note.items.map((item, itemIndex) => (
															<li key={itemIndex}>{item}</li>
														))}
													</ul>
												</div>
											</div>
										</div>
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
