'use client'

import {
	type AnchorHTMLAttributes,
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type HTMLAttributes,
	memo,
} from 'react'
import { cn } from '@/lib/utils'

type ParagraphRef = ComponentRef<'p'>
type CodeRef = ComponentRef<'code'>
type LinkRef = ComponentRef<'a'>

type ParagraphProps = ComponentPropsWithoutRef<'p'>
type CodeProps = ComponentPropsWithoutRef<'code'>
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

const TYPOGRAPHY_STYLES = {
	colors: {
		primary: 'text-slate-50',
		secondary: 'text-white/70',
		muted: 'text-slate-400',
		link: 'text-white',
	},
	headings: {
		h1: 'text-4xl md:text-5xl lg:text-[56px] font-semibold leading-tight tracking-tight',
		h2: 'text-xl md:text-2xl lg:text-[21px] font-medium leading-relaxed tracking-tight',
		h3: 'text-lg md:text-xl lg:text-[21px] font-medium leading-relaxed tracking-tight',
		h4: 'text-sm md:text-base font-medium leading-relaxed tracking-tight',
	},
	body: {
		text: 'text-sm leading-normal',
		code: 'relative rounded bg-white/10 px-1.5 py-1 font-mono text-sm font-semibold',
		link: 'underline-offset-4 hover:underline transition-colors duration-150',
	},
} as const

const LinearH1 = memo(
	forwardRef<
		HTMLHeadingElement,
		HTMLAttributes<HTMLHeadingElement> & {
			variant?: 'primary' | 'secondary' | 'muted'
		}
	>(({ className, variant = 'primary', ...props }, ref) => (
		<h1
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.headings.h1,
				TYPOGRAPHY_STYLES.colors[variant],
				className,
			)}
			{...props}
		/>
	)),
)
LinearH1.displayName = 'LinearH1'

const LinearH2 = memo(
	forwardRef<
		HTMLHeadingElement,
		HTMLAttributes<HTMLHeadingElement> & {
			variant?: 'primary' | 'secondary' | 'muted'
		}
	>(({ className, variant = 'primary', ...props }, ref) => (
		<h2
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.headings.h2,
				TYPOGRAPHY_STYLES.colors[variant],
				className,
			)}
			{...props}
		/>
	)),
)
LinearH2.displayName = 'LinearH2'

const LinearH3 = memo(
	forwardRef<
		HTMLHeadingElement,
		HTMLAttributes<HTMLHeadingElement> & {
			variant?: 'primary' | 'secondary' | 'muted'
		}
	>(({ className, variant = 'primary', ...props }, ref) => (
		<h3
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.headings.h3,
				TYPOGRAPHY_STYLES.colors[variant],
				className,
			)}
			{...props}
		/>
	)),
)
LinearH3.displayName = 'LinearH3'

const LinearH4 = memo(
	forwardRef<
		HTMLHeadingElement,
		HTMLAttributes<HTMLHeadingElement> & {
			variant?: 'primary' | 'secondary' | 'muted'
		}
	>(({ className, variant = 'primary', ...props }, ref) => (
		<h4
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.headings.h4,
				TYPOGRAPHY_STYLES.colors[variant],
				className,
			)}
			{...props}
		/>
	)),
)
LinearH4.displayName = 'LinearH4'

const createTextComponent = (
	variant: 'primary' | 'secondary' | 'muted',
	displayName: string,
) => {
	const Component = forwardRef<ParagraphRef, ParagraphProps>(
		({ className, ...props }, ref) => (
			<p
				ref={ref}
				className={cn(
					TYPOGRAPHY_STYLES.body.text,
					TYPOGRAPHY_STYLES.colors[variant],
					className,
				)}
				{...props}
			/>
		),
	)
	Component.displayName = displayName
	return memo(Component)
}

const LinearText = createTextComponent('primary', 'LinearText')
const LinearTextSecondary = createTextComponent(
	'secondary',
	'LinearTextSecondary',
)
const LinearTextMuted = createTextComponent('muted', 'LinearTextMuted')

const LinearCode = memo(
	forwardRef<CodeRef, CodeProps>(({ className, ...props }, ref) => (
		<code
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.body.code,
				TYPOGRAPHY_STYLES.colors.primary,
				className,
			)}
			{...props}
		/>
	)),
)
LinearCode.displayName = 'LinearCode'

const LinearLink = memo(
	forwardRef<LinkRef, LinkProps>(({ className, ...props }, ref) => (
		<a
			ref={ref}
			className={cn(
				TYPOGRAPHY_STYLES.colors.link,
				TYPOGRAPHY_STYLES.body.link,
				className,
			)}
			{...props}
		/>
	)),
)
LinearLink.displayName = 'LinearLink'

export {
	LinearH1,
	LinearH2,
	LinearH3,
	LinearH4,
	LinearText,
	LinearTextSecondary,
	LinearTextMuted,
	LinearCode,
	LinearLink,
}
