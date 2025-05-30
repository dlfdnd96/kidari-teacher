'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import LoginModal from '@/components/features/auth/LoginModal'
import LogoutButton from '@/components/common/LogoutButton'

export default function Navbar() {
	const [open, setOpen] = useState(false)
	const { data: session, status } = useSession()

	return (
		<>
			<nav className="w-full h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				<div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
					키다리 선생님
				</div>

				{status === 'loading' ? (
					<div className="px-6 py-2.5 bg-gray-200 rounded-full animate-pulse">
						<div className="w-12 h-5 bg-gray-300 rounded"></div>
					</div>
				) : session ? (
					<div className="flex items-center gap-4">
						{session.user?.name || session.user?.email ? (
							<span className="text-gray-700 font-medium">
								{session.user?.name
									? `${session.user.name}님`
									: session.user?.email}
							</span>
						) : null}
						<LogoutButton />
					</div>
				) : (
					<button
						onClick={() => setOpen(true)}
						className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
					>
						로그인
					</button>
				)}
			</nav>
			<LoginModal open={open} onClose={() => setOpen(false)} />
		</>
	)
}
