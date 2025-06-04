'use client'

import { useState, memo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/features/auth/LoginModal'
import LogoutButton from '@/components/common/LogoutButton'
import { SITE_INFO } from '@/constants/homepage'

const Navbar = memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data: session, status } = useSession()
	const pathname = usePathname()

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const renderNavLinks = () => {
		const links = [
			{
				href: '/notice',
				label: '공지사항',
				icon: '📢',
				isActive: pathname === '/notice',
			},
		]

		return (
			<div className="hidden sm:flex items-center gap-2">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
							link.isActive
								? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
								: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
						}`}
						aria-label={link.label}
					>
						<span className="text-sm" role="img" aria-hidden="true">
							{link.icon}
						</span>
						<span className="text-sm">{link.label}</span>
					</Link>
				))}
			</div>
		)
	}

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
			<nav className="w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				{/* 로고/제목 */}
				<Link
					href="/"
					className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
				>
					{SITE_INFO.title}
				</Link>

				{/* 네비게이션 링크 */}
				{renderNavLinks()}

				{/* 모바일 네비게이션 */}
				<div className="sm:hidden flex items-center gap-2 mr-4">
					<Link
						href="/notice"
						className={`p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
							pathname === '/notice'
								? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
								: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
						}`}
						aria-label="공지사항"
					>
						<span className="text-lg" role="img" aria-hidden="true">
							📢
						</span>
					</Link>
				</div>

				{/* 인증 섹션 */}
				<div className="flex-shrink-0">{renderAuthSection()}</div>
			</nav>
			<LoginModal open={isModalOpen} onClose={handleCloseModal} />
		</>
	)
})

Navbar.displayName = 'Navbar'

export default Navbar
