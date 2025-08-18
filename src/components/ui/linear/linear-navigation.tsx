'use client'

import {
	type AnchorHTMLAttributes,
	forwardRef,
	type HTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const LinearNavigation = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
	({ className, ...props }, ref) => (
		<nav
			ref={ref}
			className={cn(
				'fixed top-0 left-0 right-0 z-50 h-16 px-6 backdrop-blur-[20px] bg-[rgba(10,10,10,0.8)] border-b border-white/8 flex items-center justify-between',
				className,
			)}
			{...props}
		/>
	),
)
LinearNavigation.displayName = 'LinearNavigation'

const LinearNavigationBrand = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex items-center space-x-2', className)}
		{...props}
	/>
))
LinearNavigationBrand.displayName = 'LinearNavigationBrand'

const LinearNavigationMenu = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('hidden md:flex items-center space-x-6', className)}
		{...props}
	/>
))
LinearNavigationMenu.displayName = 'LinearNavigationMenu'

const LinearNavigationItem = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, href, ...props }, ref) => {
	const safeHref = href?.startsWith('javascript:') ? '#' : href

	return (
		<a
			ref={ref}
			href={safeHref}
			className={cn(
				'text-sm font-medium text-[#8A8F98] transition-colors duration-150 hover:text-[#F7F8F8] cursor-pointer',
				className,
			)}
			{...props}
		/>
	)
})
LinearNavigationItem.displayName = 'LinearNavigationItem'

const LinearNavigationActions = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex items-center space-x-3', className)}
		{...props}
	/>
))
LinearNavigationActions.displayName = 'LinearNavigationActions'

const LinearDivider = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('h-px bg-white/8 w-full', className)}
		{...props}
	/>
))
LinearDivider.displayName = 'LinearDivider'

const LinearContainer = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8', className)}
		{...props}
	/>
))
LinearContainer.displayName = 'LinearContainer'

export {
	LinearNavigation,
	LinearNavigationBrand,
	LinearNavigationMenu,
	LinearNavigationItem,
	LinearNavigationActions,
	LinearDivider,
	LinearContainer,
}
