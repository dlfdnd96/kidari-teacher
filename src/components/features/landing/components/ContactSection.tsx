'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SECTION_IDS } from '@/constants/landing'
import * as z from 'zod/mini'
import { handleEmailContact } from '@/utils/email'
import { Container } from '@/components/ui/container'

export function ContactSection() {
	const email = z.email().parse(process.env.NEXT_PUBLIC_CONTACT_EMAIL)

	return (
		<section id={SECTION_IDS.CONTACT} className="py-20">
			<Container>
				<div className="max-w-4xl mx-auto text-center space-y-16">
					<div className="space-y-6">
						<h2 className="text-5xl font-bold tracking-tight text-foreground leading-relaxed">
							연락처
						</h2>
						<div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
							<p className="text-xl text-foreground/90 leading-loose tracking-wide">
								전문직 진로에 대해 궁금하다면?
							</p>
							<Button
								size="lg"
								className="text-base tracking-tight rounded-xl focus-visible:ring-ring border border-input bg-secondary hover:bg-accent hover:text-accent-foreground text-foreground cursor-pointer"
								onClick={() => handleEmailContact(email)}
							>
								<Mail className="w-5 h-5" />
								문의하기
							</Button>
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}
