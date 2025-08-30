import Image from 'next/image'
import React, { useCallback, useMemo, useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { BRAND_INFO, MENU_ITEMS } from '@/constants/landing'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

interface MenuItem {
	id: string
	label: string
	href: string
	active?: boolean
	external?: boolean
}

const isValidUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url, window.location.origin)
		return (
			['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol) &&
			!url.toLowerCase().startsWith('javascript:')
		)
	} catch {
		return url.startsWith('/') || url.startsWith('#')
	}
}

export function TopNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prev) => !prev)
	}, [])

	const closeMenu = useCallback(() => {
		setIsMenuOpen(false)
	}, [])

	const validatedMenuItems = useMemo(() => {
		return MENU_ITEMS.filter((item) => isValidUrl(item.href))
	}, [])

	const handleMenuItemClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
			if (!isValidUrl(item.href)) {
				e.preventDefault()
				return
			}
			closeMenu()
		},
		[closeMenu],
	)

	const handleMenuItemKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLAnchorElement>, item: MenuItem) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				if (isValidUrl(item.href)) {
					window.location.href = item.href
				}
				closeMenu()
			}
		},
		[closeMenu],
	)

	return (
		<nav className="'w-full z-50 transition-all duration-200 sticky top-0 bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px] border-b border-white/5'">
			<Container>
				<div className="flex items-center justify-between h-16">
					{/* Logo/Brand */}
					<div className="flex items-center space-x-2">
						<Image
							src={BRAND_INFO.LOGO_PATH}
							alt={BRAND_INFO.LOGO_ALT || '키다리 선생님 로고'}
							width={512}
							height={512}
							className="w-8 h-8"
							priority
							onError={(e) => {
								console.warn(`로고 이미지 로딩 실패: ${BRAND_INFO.LOGO_PATH}`)
								e.currentTarget.style.display = 'none'
							}}
						/>
						<span className="text-lg font-medium text-[#F7F8F8]">
							{BRAND_INFO.NAME}
						</span>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
						{validatedMenuItems.map((item) => (
							<a
								key={item.id}
								href={item.href}
								className="text-sm font-medium transition-colors duration-150 hover:text-[#F7F8F8] text-[#8A8F98]"
								onClick={(e) => handleMenuItemClick(e, item)}
								onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
								tabIndex={0}
							>
								{item.label}
							</a>
						))}
					</div>

					{/* Mobile Menu Button */}
					<Button
						size="icon"
						className="md:hidden"
						onClick={toggleMenu}
						aria-label="Toggle menu"
						aria-expanded={isMenuOpen}
					>
						<MenuIcon />
					</Button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-white/8 py-4">
						<div className="flex flex-col space-y-4">
							{validatedMenuItems.map((item) => (
								<a
									key={item.id}
									href={item.href}
									className="text-sm font-medium transition-colors duration-150 text-[#8A8F98] hover:text-[#F7F8F8]"
									onClick={(e) => handleMenuItemClick(e, item)}
									onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
									tabIndex={0}
								>
									{item.label}
								</a>
							))}
						</div>
					</div>
				)}
			</Container>
		</nav>
	)
}
