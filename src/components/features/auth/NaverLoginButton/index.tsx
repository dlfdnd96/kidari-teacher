'use client'

import { signIn } from 'next-auth/react'
import type { FC, ButtonHTMLAttributes } from 'react'

const NaverLoginButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => (
	<button
		type="button"
		aria-label="네이버로 로그인"
		className="w-full bg-[#03C75A] hover:bg-[#02B352] rounded-xl px-4 py-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-xs"
		onClick={() => signIn('naver')}
		{...props}
	>
		<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
			<path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z" />
		</svg>
		<span className="text-white font-semibold text-[15px] drop-shadow-xs">
			네이버로 로그인
		</span>
	</button>
)

export default NaverLoginButton
