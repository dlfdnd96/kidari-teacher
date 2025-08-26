'use client'

import React, { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { LinearContainer } from './navigation'
import { LinearTextMuted } from './typography'

const CURRENT_YEAR = new Date().getFullYear()

interface LinearFooterProps extends HTMLAttributes<HTMLElement> {
	bottomText?: string
}

interface LinearSimpleFooterProps extends HTMLAttributes<HTMLElement> {
	text?: string
}

const Footer = forwardRef<HTMLElement, LinearFooterProps>(
	(
		{
			className,
			bottomText = `© ${CURRENT_YEAR} Linear UI. All rights reserved.`,
			...props
		},
		ref,
	) => (
		<footer
			ref={ref}
			className={cn('bg-[#111111] py-12', className)}
			{...props}
		>
			<LinearContainer>
				<div className="flex items-center justify-center">
					<LinearTextMuted className="text-sm">{bottomText}</LinearTextMuted>
				</div>
			</LinearContainer>
		</footer>
	),
)

Footer.displayName = 'Footer'

const LinearSimpleFooter = forwardRef<HTMLElement, LinearSimpleFooterProps>(
	(
		{
			className,
			text = `© ${CURRENT_YEAR} Company Name. All rights reserved.`,
			...props
		},
		ref,
	) => (
		<footer
			ref={ref}
			className={cn('bg-[#0A0A0A] border-t border-white/8 py-6', className)}
			{...props}
		>
			<LinearContainer>
				<LinearTextMuted className="text-center text-sm">
					{text}
				</LinearTextMuted>
			</LinearContainer>
		</footer>
	),
)

LinearSimpleFooter.displayName = 'LinearSimpleFooter'

export { Footer, LinearSimpleFooter }
