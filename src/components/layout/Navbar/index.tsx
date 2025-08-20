'use client'

import React, {
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
	useMemo,
} from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/features/auth/LoginModal'
import {
	CircleUserRound,
	Menu,
	LogIn,
	Bell,
	Heart,
	FileText,
	User,
	LogOut,
} from 'lucide-react'
import { NavLink } from '@/types/navbar'
import { AUTH_PAGE_URL_PATTERN } from '@/constants/auth'
import { Enum } from '@/enums'

const Navbar = memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const profileRef = useRef<HTMLDivElement>(null)
	const { data: session, status } = useSession()
	const pathname = usePathname()
	const router = useRouter()

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const handleLogout = useCallback(async () => {
		await signOut({ redirect: false })

		if (AUTH_PAGE_URL_PATTERN.test(pathname)) {
			router.push('/')
		}
	}, [pathname, router])

	const handleMenuToggle = useCallback(() => {
		setIsMenuOpen((prev) => !prev)
	}, [])

	const navLinks = useMemo(
		(): NavLink[] =>
			[
				{
					href: '/notice',
					label: '공지사항',
					icon: Bell,
					requireAuth: false,
				},
				{
					href: `/volunteer-activities?status=${Enum.VolunteerActivityStatus.RECRUITING}`,
					label: '봉사활동',
					icon: Heart,
					requireAuth: true,
				},
			].filter((link) => !link.requireAuth || session),
		[session],
	)

	const getColorClasses = useCallback(() => {
		return 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
	}, [])

	const getDropdownColorClasses = useCallback(() => {
		return 'text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-50 hover:shadow-sm'
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

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100/50 z-[999]">
				{/* 왼쪽 - 햄버거 메뉴 + 네비게이션 링크들 */}
				<div className="flex items-center gap-3 flex-1" ref={menuRef}>
					<button
						onClick={handleMenuToggle}
						className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:bg-gray-100 cursor-pointer"
						aria-label="메뉴"
						type="button"
					>
						<Menu size={20} className="text-gray-600" />
					</button>

					{/* 데스크탑 네비게이션 링크들 */}
					<div className="hidden lg:flex items-center gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${getColorClasses()}`}
								aria-label={link.label}
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* 드롭다운 메뉴 */}
					{isMenuOpen && (
						<div className="absolute left-4 top-14 z-[9999] min-w-[180px] bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl py-2 animate-fade-in">
							{navLinks.map((link) => {
								const IconComponent = link.icon

								return (
									<Link
										key={link.href}
										href={link.href}
										className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${getDropdownColorClasses()}`}
										aria-label={link.label}
										onClick={() => setIsMenuOpen(false)}
									>
										<IconComponent size={16} />
										<span className="group-hover:font-semibold transition-all duration-200">
											{link.label}
										</span>
									</Link>
								)
							})}
						</div>
					)}
				</div>

				{/* 가운데 - 타이틀 */}
				<div className="flex-1 flex items-center justify-center">
					<Link href="/" className="flex items-center">
						<span className="text-lg sm:text-xl font-bold bg-gradient-to-r whitespace-nowrap">
							temp
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
								className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:bg-gray-100 cursor-pointer"
								aria-label="프로필"
								type="button"
							>
								<CircleUserRound size={20} className="text-gray-600" />
							</button>
							{isProfileOpen && (
								<div className="absolute right-0 top-12 z-[9999] min-w-[160px] bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl py-2 animate-fade-in">
									{/* 사용자 정보 */}
									<div className="px-4 py-2 border-b border-gray-100">
										<div className="text-sm font-medium text-gray-900 truncate">
											{session.user?.name}
										</div>
										<div className="text-xs text-gray-500 truncate">
											{session.user?.email}
										</div>
									</div>

									{/* 프로필 메뉴들 */}
									<Link
										href="/my-applications"
										className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
										onClick={() => setIsProfileOpen(false)}
									>
										<FileText size={16} />내 신청 내역
									</Link>

									<Link
										href="/profile"
										className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
										onClick={() => setIsProfileOpen(false)}
									>
										<User size={16} />
										프로필
									</Link>

									<div className="border-t border-gray-100 mt-2 pt-2">
										<button
											onClick={() => {
												handleLogout()
												setIsProfileOpen(false)
											}}
											className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
										>
											<LogOut size={16} />
											로그아웃
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<>
							{/* 모바일 로그인 아이콘 */}
							<button
								onClick={handleOpenModal}
								className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:bg-gray-100 sm:hidden"
								aria-label="로그인"
								type="button"
							>
								<LogIn size={20} className="text-gray-600" />
							</button>

							{/* 데스크탑 로그인 버튼 */}
							<button
								onClick={handleOpenModal}
								className="hidden sm:inline-block px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
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
