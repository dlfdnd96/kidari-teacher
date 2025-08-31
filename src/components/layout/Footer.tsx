'use client'

import React, { memo } from 'react'
import { Container } from '@/components/ui/container'

interface FooterProps {
	bottomText?: string
}

const Footer = memo(({ bottomText }: FooterProps) => (
	<footer className="bg-primary-foreground py-12">
		<Container>
			<div className="flex items-center justify-center">
				<p className="text-sm leading-normal text-slate-400">{bottomText}</p>
			</div>
		</Container>
	</footer>
))

Footer.displayName = 'Footer'

export { Footer }
