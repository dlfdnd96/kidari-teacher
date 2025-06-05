'use client'

import { useState, memo, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/features/auth/LoginModal'
import LogoutButton from '@/components/common/LogoutButton'
import { SITE_INFO } from '@/constants/homepage'
import Image from 'next/image'
import {
	DEFAULT_PROFILE_IMG,
	HOMEPAGE_LOGO_IMG,
	LOGIN_LOGO_IMG,
	LOGOUT_LOGO_IMG,
} from '@/constants/navbar'

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

	const handleLogout = useCallback(async () => {
		await signOut()
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

	return (
		<>
			<nav className="w-full h-16 flex items-center justify-between px-2 sm:px-6 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				{/* 로고/제목 */}
				<Link href="/" className="flex items-center">
					{/* 모바일: 간단한 심볼, 데스크탑: 텍스트 */}
					<span
						className="block sm:hidden text-xl font-bold text-blue-600"
						aria-label="홈"
					>
						<Image
							width={256}
							height={256}
							src={HOMEPAGE_LOGO_IMG.src}
							alt={HOMEPAGE_LOGO_IMG.alt}
							className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
						/>
					</span>
					<span className="hidden sm:block text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
						{SITE_INFO.title}
					</span>
				</Link>

				{/* 네비게이션 링크 */}
				{renderNavLinks()}

				{/* 모바일 네비게이션 */}
				<div className="sm:hidden flex items-center gap-2 mr-2">
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
				<div className="flex-shrink-0 min-w-0">
					{status === 'loading' ? (
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
					) : session ? (
						<div className="flex items-center gap-2">
							{/* 프로필 이미지 (없으면 기본) */}
							<Image
								width={256}
								height={256}
								src={session.user?.image || DEFAULT_PROFILE_IMG.src}
								alt={DEFAULT_PROFILE_IMG.alt}
								className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
							/>
							{/* 로그아웃: 모바일은 간단한 텍스트, 데스크탑은 버튼 */}
							<button
								onClick={handleLogout}
								className="ml-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors sm:hidden"
								aria-label="로그아웃"
								type="button"
							>
								<Image
									width={256}
									height={256}
									src={LOGOUT_LOGO_IMG.src}
									alt={LOGOUT_LOGO_IMG.alt}
									className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
								/>
							</button>
							<div className="hidden sm:block">
								<LogoutButton />
							</div>
						</div>
					) : (
						<>
							{/* 모바일: 간단한 텍스트, 데스크탑: 기존 버튼 */}
							<button
								onClick={handleOpenModal}
								className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors sm:hidden"
								aria-label="로그인"
								type="button"
							>
								<Image
									width={256}
									height={256}
									src={LOGIN_LOGO_IMG.src}
									alt={LOGIN_LOGO_IMG.alt}
									className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
								/>
							</button>
							<button
								onClick={handleOpenModal}
								className="hidden sm:inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
								aria-label="로그인"
								type="button"
							>
								로그인
							</button>
						</>
					)}
				</div>
			</nav>
			<LoginModal open={isModalOpen} onClose={handleCloseModal} />
		</>
	)
})

Navbar.displayName = 'Navbar'

export default Navbar
