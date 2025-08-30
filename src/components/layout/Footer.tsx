'use client'

import React, { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'

interface LinearFooterProps extends HTMLAttributes<HTMLElement> {
	bottomText?: string
}

const Footer = forwardRef<HTMLElement, LinearFooterProps>(
	({ className, bottomText, ...props }, ref) => (
		<footer
			ref={ref}
			className={cn('bg-[#111111] py-12', className)}
			{...props}
		>
			<Container>
				<div className="flex items-center justify-center">
					<p className="text-sm leading-normal text-slate-400">{bottomText}</p>
				</div>
			</Container>
		</footer>
	),
)

Footer.displayName = 'Footer'

export { Footer }
