import * as z from 'zod/mini'
import { handleEmailContact } from '@/utils/email'
import { BRAND_INFO } from '@/constants/landing'
import { motion } from 'framer-motion'
import { Circle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/linear'
import React, { memo, useCallback } from 'react'

interface HeroAction {
	label: string
	onClick: () => void
}

interface ActionButtonProps {
	action: HeroAction
	variant: 'primary' | 'secondary'
}

const WAVE_PATTERN_STYLES = {
	base: `radial-gradient(circle at 20% 80%, rgba(190, 195, 205, 0.06) 0%, transparent 50%),
	       radial-gradient(circle at 80% 20%, rgba(170, 175, 185, 0.08) 0%, transparent 50%),
	       radial-gradient(circle at 40% 40%, rgba(155, 160, 170, 0.10) 0%, transparent 50%)`,
	animated: `radial-gradient(circle at 60% 30%, rgba(180, 185, 195, 0.07) 0%, transparent 60%),
	           radial-gradient(circle at 30% 70%, rgba(165, 170, 180, 0.06) 0%, transparent 60%)`,
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

const sanitizeText = (text: string): string => {
	return text
		.replace(/<script[^>]*>.*?<\/script>/gi, '')
		.replace(/<[^>]*>/g, '')
		.trim()
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

const ActionButton = memo(({ action, variant }: ActionButtonProps) => {
	const handleClick = useCallback(() => {
		if (action.onClick) {
			action.onClick()
		}
	}, [action])

	const baseProps = {
		variant,
		size: 'lg' as const,
		onClick: handleClick,
	}

	return (
		<Button
			{...baseProps}
			className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10"
		>
			<Mail className="w-5 h-5" />
			{sanitizeText(action.label)}
		</Button>
	)
})

ActionButton.displayName = 'ActionButton'

export function HeroSection() {
	const sanitizedTitle = sanitizeText(BRAND_INFO.NAME)
	const sanitizedSubtitle = sanitizeText(BRAND_INFO.SUBTITLE)
	const sanitizedDescription = sanitizeText(BRAND_INFO.DESCRIPTION)

	const email = z.email().parse(process.env.NEXT_PUBLIC_CONTACT_EMAIL)

	return (
		<section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--theme-primary,#030303)]">
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

					<motion.div
						variants={FADE_UP_VARIANTS}
						initial="hidden"
						animate="visible"
						transition={{
							duration: ANIMATION_CONFIG.durations.fast,
							delay: ANIMATION_CONFIG.delays.actions,
							ease: ANIMATION_CONFIG.ease,
						}}
						className="flex flex-wrap gap-4 justify-center"
					>
						<ActionButton
							action={{
								label: '문의하기',
								onClick: () => handleEmailContact(email),
							}}
							variant="primary"
						/>
					</motion.div>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-primary,#030303)] via-transparent to-[var(--theme-primary,#030303)]/80 pointer-events-none" />
		</section>
	)
}
