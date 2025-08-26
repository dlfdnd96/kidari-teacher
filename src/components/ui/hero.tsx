'use client'

import React, {
	forwardRef,
	memo,
	useCallback,
	type HTMLAttributes,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Circle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LinearContainer } from './navigation'
import { LinearH1, LinearText } from './typography'
import { Button } from './button'

const WAVE_PATTERN_STYLES = {
	base: `radial-gradient(circle at 20% 80%, rgba(190, 195, 205, 0.06) 0%, transparent 50%),
	       radial-gradient(circle at 80% 20%, rgba(170, 175, 185, 0.08) 0%, transparent 50%),
	       radial-gradient(circle at 40% 40%, rgba(155, 160, 170, 0.10) 0%, transparent 50%)`,
	animated: `radial-gradient(circle at 60% 30%, rgba(180, 185, 195, 0.07) 0%, transparent 60%),
	           radial-gradient(circle at 30% 70%, rgba(165, 170, 180, 0.06) 0%, transparent 60%)`,
} as const

const HEIGHT_CLASSES = {
	sm: 'min-h-[400px]',
	md: 'min-h-[500px]',
	lg: 'min-h-[600px]',
	xl: 'min-h-[700px]',
	full: 'min-h-screen',
} as const

const FADE_UP_VARIANTS = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0 },
} as const

const ANIMATION_CONFIG = {
	ease: [0.25, 0.4, 0.25, 1] as const,
	durations: {
		fast: 1,
		slow: 2,
		wave: 3,
	},
	delays: {
		subtitle: 0.5,
		title: 0.7,
		description: 0.9,
		actions: 1.1,
	},
} as const

function sanitizeText(text: string): string {
	return text
		.replace(/<script[^>]*>.*?<\/script>/gi, '')
		.replace(/<[^>]*>/g, '')
		.trim()
}

function isValidUrl(url: string, allowedDomains?: string[]): boolean {
	try {
		const urlObj = new URL(url)
		if (allowedDomains && allowedDomains.length > 0) {
			return allowedDomains.some((domain) => urlObj.hostname.endsWith(domain))
		}
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
	} catch {
		return false
	}
}

const WavePattern = memo(() => {
	return (
		<motion.div
			className="absolute inset-0"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: ANIMATION_CONFIG.durations.slow }}
			style={{ background: WAVE_PATTERN_STYLES.base }}
		>
			<motion.div
				className="absolute inset-0"
				animate={{
					backgroundPosition: ['0% 0%', '100% 100%'],
				}}
				transition={{
					duration: ANIMATION_CONFIG.durations.wave,
					repeatType: 'reverse',
					ease: 'easeInOut',
				}}
				style={{ background: WAVE_PATTERN_STYLES.animated }}
			/>
		</motion.div>
	)
})

WavePattern.displayName = 'WavePattern'

interface HeroAction {
	label: string
	onClick?: () => void
	href?: string
	target?: '_blank' | '_self'
	rel?: string
}

interface LinearHeroProps extends HTMLAttributes<HTMLElement> {
	title?: string
	subtitle?: string
	description?: string
	primaryAction?: HeroAction
	secondaryAction?: HeroAction
	backgroundImage?: string
	backgroundImageAlt?: string
	overlay?: boolean
	centered?: boolean
	height?: keyof typeof HEIGHT_CLASSES
	animated?: boolean
	allowedDomains?: string[]
}

interface ActionButtonProps {
	action: HeroAction
	variant: 'primary' | 'secondary'
}

const ActionButton = memo(({ action, variant }: ActionButtonProps) => {
	const handleClick = useCallback(() => {
		if (action.onClick) {
			action.onClick()
		}
	}, [action])

	const isExternalLink = action.href && action.href.startsWith('http')
	const baseProps = {
		variant,
		size: 'lg' as const,
		onClick: action.href ? undefined : handleClick,
	}

	if (action.href && !isExternalLink) {
		const linkProps = {
			...baseProps,
			as: Link,
			href: action.href,
		}

		if (variant === 'primary') {
			return (
				<Button
					{...linkProps}
					className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10"
				>
					<Mail className="w-5 h-5" />
					{sanitizeText(action.label)}
				</Button>
			)
		}

		return <Button {...linkProps}>{sanitizeText(action.label)}</Button>
	}

	if (isExternalLink) {
		const externalProps = {
			...baseProps,
			as: 'a' as const,
			href: action.href,
			target: action.target || '_blank',
			rel: action.rel || 'noopener noreferrer',
		}

		if (variant === 'primary') {
			return (
				<Button
					{...externalProps}
					className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10"
				>
					<Mail className="w-5 h-5" />
					{sanitizeText(action.label)}
				</Button>
			)
		}

		return <Button {...externalProps}>{sanitizeText(action.label)}</Button>
	}

	if (variant === 'primary') {
		return (
			<Button
				{...baseProps}
				className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10"
			>
				<Mail className="w-5 h-5" />
				{sanitizeText(action.label)}
			</Button>
		)
	}

	return <Button {...baseProps}>{sanitizeText(action.label)}</Button>
})

ActionButton.displayName = 'ActionButton'

const Hero = forwardRef<HTMLElement, LinearHeroProps>(
	(
		{
			className,
			title = 'Welcome to Linear UI',
			subtitle,
			description = 'A comprehensive design system built for modern applications with dark theme optimization.',
			primaryAction,
			secondaryAction,
			backgroundImage,
			backgroundImageAlt,
			overlay = true,
			centered = true,
			height = 'lg',
			animated = false,
			allowedDomains,
			children,
			...props
		},
		ref,
	) => {
		const sanitizedTitle = sanitizeText(title)
		const sanitizedSubtitle = subtitle ? sanitizeText(subtitle) : undefined
		const sanitizedDescription = sanitizeText(description)

		const isValidBackgroundImage =
			backgroundImage && isValidUrl(backgroundImage, allowedDomains)

		if (animated) {
			return (
				<section
					ref={ref}
					className={cn(
						'relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--theme-primary,#030303)]',
						className,
					)}
					{...props}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

					<div className="absolute inset-0 overflow-hidden">
						<WavePattern />
					</div>

					<div className="relative z-10 container mx-auto px-4 md:px-6">
						<div className="max-w-3xl mx-auto text-center">
							{sanitizedSubtitle && (
								<motion.div
									variants={FADE_UP_VARIANTS}
									initial="hidden"
									animate="visible"
									transition={{
										duration: ANIMATION_CONFIG.durations.fast,
										delay: ANIMATION_CONFIG.delays.subtitle,
										ease: ANIMATION_CONFIG.ease,
									}}
									className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
								>
									<Circle className="h-2 w-2 fill-rose-500/80" />
									<span className="text-sm text-white/60 tracking-wide">
										{sanitizedSubtitle}
									</span>
								</motion.div>
							)}

							<motion.div
								variants={FADE_UP_VARIANTS}
								initial="hidden"
								animate="visible"
								transition={{
									duration: ANIMATION_CONFIG.durations.fast,
									delay: ANIMATION_CONFIG.delays.title,
									ease: ANIMATION_CONFIG.ease,
								}}
							>
								<h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight text-white">
									{sanitizedTitle}
								</h1>
							</motion.div>

							<motion.div
								variants={FADE_UP_VARIANTS}
								initial="hidden"
								animate="visible"
								transition={{
									duration: ANIMATION_CONFIG.durations.fast,
									delay: ANIMATION_CONFIG.delays.description,
									ease: ANIMATION_CONFIG.ease,
								}}
							>
								<p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
									{sanitizedDescription}
								</p>
							</motion.div>

							{(primaryAction || secondaryAction || children) && (
								<motion.div
									variants={FADE_UP_VARIANTS}
									initial="hidden"
									animate="visible"
									transition={{
										duration: ANIMATION_CONFIG.durations.fast,
										delay: ANIMATION_CONFIG.delays.actions,
										ease: ANIMATION_CONFIG.ease,
									}}
									className={cn(
										'flex flex-wrap gap-4',
										centered ? 'justify-center' : 'justify-start',
									)}
								>
									{primaryAction && (
										<ActionButton action={primaryAction} variant="primary" />
									)}
									{secondaryAction && (
										<ActionButton
											action={secondaryAction}
											variant="secondary"
										/>
									)}
									{children}
								</motion.div>
							)}
						</div>
					</div>

					<div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-primary,#030303)] via-transparent to-[var(--theme-primary,#030303)]/80 pointer-events-none" />
				</section>
			)
		}

		return (
			<section
				ref={ref}
				className={cn(
					'relative flex items-center',
					HEIGHT_CLASSES[height],
					isValidBackgroundImage && 'overflow-hidden',
					className,
				)}
				{...props}
			>
				{isValidBackgroundImage && (
					<>
						<Image
							src={backgroundImage}
							alt={backgroundImageAlt || ''}
							fill
							className="object-cover z-0"
							priority
						/>
						{overlay && <div className="absolute inset-0 bg-black/50 z-10" />}
					</>
				)}

				<LinearContainer className="relative z-20 w-full">
					<div className={cn('max-w-4xl', centered && 'mx-auto text-center')}>
						{sanitizedSubtitle && (
							<div className="mb-4">
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-[var(--theme-text-secondary,#E6E6E6)] border border-white/20">
									{sanitizedSubtitle}
								</span>
							</div>
						)}

						<LinearH1 className={cn('mb-6', !centered && 'text-left')}>
							{sanitizedTitle}
						</LinearH1>

						<LinearText
							className={cn(
								'text-lg text-white/80 mb-8 leading-relaxed',
								centered ? 'mx-auto max-w-2xl' : 'max-w-xl',
							)}
						>
							{sanitizedDescription}
						</LinearText>

						{(primaryAction || secondaryAction || children) && (
							<div
								className={cn(
									'flex flex-wrap gap-4',
									centered ? 'justify-center' : 'justify-start',
								)}
							>
								{primaryAction && (
									<ActionButton action={primaryAction} variant="primary" />
								)}
								{secondaryAction && (
									<ActionButton action={secondaryAction} variant="secondary" />
								)}
								{children}
							</div>
						)}
					</div>
				</LinearContainer>
			</section>
		)
	},
)

Hero.displayName = 'Hero'

// Simple Hero variant
const LinearSimpleHero = forwardRef<
	HTMLElement,
	HTMLAttributes<HTMLElement> & {
		title?: string
		description?: string
	}
>(
	(
		{
			className,
			title = 'Welcome',
			description = 'Get started with our platform.',
			...props
		},
		ref,
	) => (
		<section
			ref={ref}
			className={cn('py-20 text-center', className)}
			{...props}
		>
			<LinearContainer>
				<LinearH1 className="mb-4">{title}</LinearH1>
				<LinearText className="text-lg text-white/80 max-w-2xl mx-auto">
					{description}
				</LinearText>
			</LinearContainer>
		</section>
	),
)

LinearSimpleHero.displayName = 'LinearSimpleHero'

// Feature Hero with cards/features
const LinearFeatureHero = forwardRef<
	HTMLElement,
	HTMLAttributes<HTMLElement> & {
		title?: string
		description?: string
		features?: Array<{
			icon?: React.ReactNode
			title: string
			description: string
		}>
	}
>(
	(
		{
			className,
			title = 'Why Choose Us',
			description = 'Here are some reasons why our platform stands out.',
			features = [],
			...props
		},
		ref,
	) => (
		<section ref={ref} className={cn('py-20', className)} {...props}>
			<LinearContainer>
				<div className="text-center mb-16">
					<LinearH1 className="mb-4">{title}</LinearH1>
					<LinearText className="text-lg text-white/80 max-w-2xl mx-auto">
						{description}
					</LinearText>
				</div>

				{features.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="text-center">
								{feature.icon && (
									<div className="flex justify-center mb-4">{feature.icon}</div>
								)}
								<h3 className="text-xl font-medium text-[#F7F8F8] mb-2">
									{feature.title}
								</h3>
								<LinearText className="text-white/70">
									{feature.description}
								</LinearText>
							</div>
						))}
					</div>
				)}
			</LinearContainer>
		</section>
	),
)

LinearFeatureHero.displayName = 'LinearFeatureHero'

export { Hero, LinearSimpleHero, LinearFeatureHero }
