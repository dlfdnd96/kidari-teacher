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
						<h2 className="text-5xl font-bold tracking-tight text-white leading-relaxed">
							연락처
						</h2>
						<div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
							<p className="text-xl text-white/90 leading-loose tracking-wide">
								전문직 진로에 대해 궁금하다면?
							</p>
							<Button
								size="lg"
								className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
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
