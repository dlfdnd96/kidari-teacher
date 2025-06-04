'use client'

import { useState, memo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import LoginModal from '@/components/features/auth/LoginModal'
import LogoutButton from '@/components/common/LogoutButton'
import { SITE_INFO } from '@/constants/homepage'

const Navbar = memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data: session, status } = useSession()

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const renderAuthSection = () => {
		if (status === 'loading') {
			return (
				<div className="px-6 py-2.5 bg-gray-200 rounded-full animate-pulse">
					<div className="w-12 h-5 bg-gray-300 rounded" />
				</div>
			)
		}

		if (session) {
			return (
				<div className="flex items-center gap-4">
					{(session.user?.name || session.user?.email) && (
						<span className="text-gray-700 font-medium">
							{session.user?.name
								? `${session.user.name}님`
								: session.user?.email}
						</span>
					)}
					<LogoutButton />
				</div>
			)
		}

		return (
			<button
				onClick={handleOpenModal}
				className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
				aria-label="로그인"
			>
				로그인
			</button>
		)
	}

	return (
		<>
			<nav className="w-full h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				<div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
					{SITE_INFO.title}
				</div>
				{renderAuthSection()}
			</nav>
			<LoginModal open={isModalOpen} onClose={handleCloseModal} />
		</>
	)
})

Navbar.displayName = 'Navbar'

export default Navbar
