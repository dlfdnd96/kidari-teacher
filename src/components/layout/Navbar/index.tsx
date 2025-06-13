'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/features/auth/LoginModal'
import { SITE_INFO } from '@/constants/homepage'
import { CircleUserRound, Menu, LogIn } from 'lucide-react'

const Navbar = memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const profileRef = useRef<HTMLDivElement>(null)
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

	const handleMenuToggle = useCallback(() => {
		setIsMenuOpen((prev) => !prev)
	}, [])

	useEffect(() => {
		if (!isMenuOpen) return
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isMenuOpen])

	useEffect(() => {
		if (!isProfileOpen) {
			return
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isProfileOpen])

	const navLinks = [
		{
			href: '/notice',
			label: '공지사항',
			isActive: pathname === '/notice',
		},
	]

	return (
		<>
			<nav className="w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				{/* 왼쪽 - 햄버거 메뉴 + 공지사항 */}
				<div className="flex items-center gap-3 flex-1" ref={menuRef}>
					<button
						onClick={handleMenuToggle}
						className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-gray-100"
						aria-label="메뉴"
						type="button"
					>
						<Menu size={20} className="text-gray-600" />
					</button>

					{/* 데스크탑 공지사항 링크 */}
					<div className="hidden sm:flex items-center">
						<Link
							href="/notice"
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
								pathname === '/notice'
									? 'text-blue-600 bg-blue-50 font-semibold'
									: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
							}`}
							aria-label="공지사항"
						>
							공지사항
						</Link>
					</div>

					{/* 드롭다운 메뉴 */}
					{isMenuOpen && (
						<div className="absolute left-4 top-14 z-50 min-w-[140px] bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl py-2 animate-fade-in">
							{navLinks.map((link) => {
								return (
									<Link
										key={link.href}
										href={link.href}
										className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-sm ${
											link.isActive
												? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 font-semibold shadow-sm'
												: 'text-gray-700 hover:text-blue-600'
										}`}
										aria-label={link.label}
										onClick={() => setIsMenuOpen(false)}
									>
										<span className="group-hover:font-semibold transition-all duration-200">
											{link.label}
										</span>
										{link.isActive && (
											<div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
										)}
									</Link>
								)
							})}
						</div>
					)}
				</div>

				{/* 가운데 - 타이틀 */}
				<div className="flex-1 flex items-center justify-center">
					<Link href="/" className="flex items-center">
						<span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
							{SITE_INFO.title}
						</span>
					</Link>
				</div>

				{/* 오른쪽 - 인증 섹션 */}
				<div className="flex items-center justify-end flex-1">
					{status === 'loading' ? (
						<div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
					) : session ? (
						<div className="flex items-center relative" ref={profileRef}>
							<button
								onClick={() => setIsProfileOpen((prev) => !prev)}
								className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-gray-100"
								aria-label="프로필"
								type="button"
							>
								<CircleUserRound size={20} className="text-gray-600" />
							</button>
							{isProfileOpen && (
								<div className="absolute right-0 top-12 z-50 min-w-[120px] bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fade-in">
									<button
										onClick={() => {
											handleLogout()
											setIsProfileOpen(false)
										}}
										className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										로그아웃
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							{/* 모바일 로그인 아이콘 */}
							<button
								onClick={handleOpenModal}
								className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-gray-100 sm:hidden"
								aria-label="로그인"
								type="button"
							>
								<LogIn size={20} className="text-gray-600" />
							</button>

							{/* 데스크탑 로그인 버튼 */}
							<button
								onClick={handleOpenModal}
								className="hidden sm:inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
