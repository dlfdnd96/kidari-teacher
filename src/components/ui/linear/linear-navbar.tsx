'use client'

import React, {
	forwardRef,
	type HTMLAttributes,
	useCallback,
	useMemo,
	useState,
} from 'react'
import { cn } from '@/lib/utils'
import { LinearButton } from './linear-button'
import { LinearContainer } from './linear-navigation'

interface MenuItem {
	id: string
	label: string
	href: string
	active?: boolean
	external?: boolean
}

interface LinearNavbarProps extends HTMLAttributes<HTMLElement> {
	logo?: React.ReactNode
	logoText?: string
	menuItems?: MenuItem[]
	sticky?: boolean
	transparent?: boolean
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

const LinearNavbar = forwardRef<HTMLElement, LinearNavbarProps>(
	(
		{
			className,
			logo,
			logoText = 'Linear UI',
			menuItems = [],
			sticky = true,
			transparent = false,
			...props
		},
		ref,
	) => {
		const [isMenuOpen, setIsMenuOpen] = useState(false)

		const toggleMenu = useCallback(() => {
			setIsMenuOpen((prev) => !prev)
		}, [])

		const closeMenu = useCallback(() => {
			setIsMenuOpen(false)
		}, [])

		const validatedMenuItems = useMemo(() => {
			return menuItems.filter((item) => isValidUrl(item.href))
		}, [menuItems])

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
			<nav
				ref={ref}
				className={cn(
					'w-full z-50 transition-all duration-200',
					sticky && 'sticky top-0',
					transparent
						? 'bg-transparent'
						: 'bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px]',
					'border-b border-white/5',
					className,
				)}
				{...props}
			>
				<LinearContainer>
					<div className="flex items-center justify-between h-16">
						{/* Logo/Brand */}
						<div className="flex items-center space-x-2">
							{logo}
							<span className="text-lg font-medium text-[#F7F8F8]">
								{logoText}
							</span>
						</div>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
							{validatedMenuItems.map((item) => (
								<a
									key={item.id}
									href={item.href}
									className={cn(
										'text-sm font-medium transition-colors duration-150 hover:text-[#F7F8F8]',
										item.active ? 'text-[#F7F8F8]' : 'text-[#8A8F98]',
									)}
									onClick={(e) => handleMenuItemClick(e, item)}
									onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
									tabIndex={0}
									{...(item.external && {
										target: '_blank',
										rel: 'noopener noreferrer',
									})}
								>
									{item.label}
								</a>
							))}
						</div>

						{/* Mobile Menu Button */}
						<LinearButton
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={toggleMenu}
							aria-label="Toggle menu"
							aria-expanded={isMenuOpen}
						>
							<MenuIcon isOpen={isMenuOpen} />
						</LinearButton>
					</div>

					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="md:hidden border-t border-white/8 py-4">
							<div className="flex flex-col space-y-4">
								{validatedMenuItems.map((item) => (
									<a
										key={item.id}
										href={item.href}
										className={cn(
											'text-sm font-medium transition-colors duration-150',
											item.active
												? 'text-[#F7F8F8]'
												: 'text-[#8A8F98] hover:text-[#F7F8F8]',
										)}
										onClick={(e) => handleMenuItemClick(e, item)}
										onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
										tabIndex={0}
										{...(item.external && {
											target: '_blank',
											rel: 'noopener noreferrer',
										})}
									>
										{item.label}
									</a>
								))}
							</div>
						</div>
					)}
				</LinearContainer>
			</nav>
		)
	},
)

LinearNavbar.displayName = 'LinearNavbar'

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		{isOpen ? (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		) : (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 6h16M4 12h16M4 18h16"
			/>
		)}
	</svg>
)

const LinearNavbarLogo = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={cn('flex items-center', className)} {...props}>
		{children}
	</div>
))

LinearNavbarLogo.displayName = 'LinearNavbarLogo'

export { LinearNavbar, LinearNavbarLogo }
