'use client'

import { FC } from 'react'
import NaverLoginButton from '@/components/features/auth/NaverLoginButton'
import KakaoLoginButton from '@/components/features/auth/KakaoLoginButton'
import GoogleLoginButton from '@/components/features/auth/GoogleLoginButton'

interface LoginModalProps {
	open: boolean
	onClose: () => void
}

const LoginModal: FC<LoginModalProps> = ({ open, onClose }) => {
	if (!open) return null

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
		>
			<div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-sm relative border border-gray-100/50 transform transition-all duration-300">
				<button
					onClick={onClose}
					aria-label="닫기"
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<div className="text-center mb-8">
					<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
						로그인
					</h2>
					<p className="text-gray-600 text-sm">
						키다리 선생님과 함께 성장해보세요
					</p>
				</div>

				<div className="space-y-3">
					<NaverLoginButton />
					<KakaoLoginButton />
					<GoogleLoginButton />
				</div>
			</div>
		</div>
	)
}

export default LoginModal
