'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/features/auth/LoginModal'
import { SITE_INFO } from '@/constants/homepage'
import { CircleUserRound, Ellipsis, House, LogIn } from 'lucide-react'

const Navbar = memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isMoreOpen, setIsMoreOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const moreRef = useRef<HTMLDivElement>(null)
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

	const handleMoreToggle = useCallback(() => {
		setIsMoreOpen((prev) => !prev)
	}, [])

	useEffect(() => {
		if (!isMoreOpen) return
		const handleClickOutside = (event: MouseEvent) => {
			if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
				setIsMoreOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isMoreOpen])

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

	const renderNavLinksDesktop = () => (
		<div className="hidden sm:flex items-center gap-2">
			{navLinks.map((link) => {
				return (
					<Link
						key={link.href}
						href={link.href}
						className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
							link.isActive
								? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
						}`}
						aria-label={link.label}
					>
						<span className="text-sm">{link.label}</span>
					</Link>
				)
			})}
		</div>
	)

	const renderNavLinksMobile = () => (
		<div className="sm:hidden flex items-center gap-2 mr-2" ref={moreRef}>
			<button
				onClick={handleMoreToggle}
				className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md`}
				aria-label="더보기"
				type="button"
			>
				{/* 점 3개 아이콘 */}
				<Ellipsis />
			</button>
			{isMoreOpen && (
				<div className="absolute right-2 top-14 z-50 min-w-[140px] bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl py-2 animate-fade-in">
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
								onClick={() => setIsMoreOpen(false)}
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
	)

	return (
		<>
			<nav className="w-full h-16 flex items-center justify-between px-2 sm:px-6 bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed top-0 left-0 z-40">
				{/* 로고/제목 */}
				<Link href="/" className="flex items-center">
					{/* 모바일: 간단한 심볼, 데스크탑: 텍스트 */}
					<span
						className="block sm:hidden text-xl font-bold text-blue-600"
						aria-label="홈"
					>
						<House />
					</span>
					<span className="hidden sm:block text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
						{SITE_INFO.title}
					</span>
				</Link>

				{/* 네비게이션 링크 - 오른쪽 끝 정렬 */}
				<div className="flex-1 flex justify-end items-center relative">
					{renderNavLinksDesktop()}
					{renderNavLinksMobile()}
				</div>

				{/* 인증 섹션 */}
				<div className="shrink-0 min-w-0 ml-8">
					{status === 'loading' ? (
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
					) : session ? (
						<div className="flex items-center gap-2 relative" ref={profileRef}>
							<CircleUserRound
								onClick={() => setIsProfileOpen((prev) => !prev)}
								className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
								aria-label="프로필"
								tabIndex={0}
								role="button"
							/>
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
							{/* 모바일: 간단한 텍스트, 데스크탑: 기존 버튼 */}
							<button
								onClick={handleOpenModal}
								className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors sm:hidden cursor-pointer"
								aria-label="로그인"
								type="button"
							>
								<LogIn />
							</button>
							<button
								onClick={handleOpenModal}
								className="hidden sm:inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
