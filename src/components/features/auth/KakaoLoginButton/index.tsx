'use client'

import { signIn } from 'next-auth/react'
import type { FC, ButtonHTMLAttributes } from 'react'

const KakaoLoginButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => (
	<button
		type="button"
		aria-label="카카오로 로그인"
		className="w-full bg-[#FEE500] hover:bg-[#FADA0A] rounded-xl px-4 py-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-xs cursor-pointer"
		onClick={() => signIn('kakao', { callbackUrl: '/profile/check' })}
		{...props}
	>
		<svg
			className="w-5 h-5 text-[#3C1E1E]"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M12 3C7.03 3 3 6.24 3 10.2c0 2.52 1.64 4.74 4.1 6.05l-.98 3.64c-.09.34.25.61.55.43l4.38-2.9c.32.02.64.03.95.03 4.97 0 9-3.24 9-7.25S16.97 3 12 3z" />
		</svg>
		<span className="text-[#3C1E1E] font-medium text-[15px]">
			카카오로 로그인
		</span>
	</button>
)

export default KakaoLoginButton
