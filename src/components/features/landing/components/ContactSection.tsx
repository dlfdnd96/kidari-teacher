'use client'

import { Mail } from 'lucide-react'
import { LinearContainer } from '@/components/ui/linear/navigation'
import { Button } from '@/components/ui/linear/button'
import { LinearH2, LinearText } from '@/components/ui/linear/typography'
import { SECTION_IDS } from '@/constants/landing'
import * as z from 'zod/mini'
import { handleEmailContact } from '@/utils/email'

export function ContactSection() {
	const email = z.email().parse(process.env.NEXT_PUBLIC_CONTACT_EMAIL)

	return (
		<section id={SECTION_IDS.CONTACT} className="py-20">
			<LinearContainer>
				<div className="max-w-4xl mx-auto text-center space-y-16">
					<div className="space-y-6">
						<LinearH2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
							연락처
						</LinearH2>
						<div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
							<LinearText className="text-xl text-white/90 leading-loose tracking-wide">
								전문직 진로에 대해 궁금하다면?
							</LinearText>
							<Button
								variant="primary"
								size="lg"
								className="px-8 py-4 text-base font-medium tracking-tight rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/90 hover:text-[#08090A] hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-200 hover:-translate-y-0.5"
								onClick={() => handleEmailContact(email)}
							>
								<Mail className="w-5 h-5" />
								문의하기
							</Button>
						</div>
					</div>
				</div>
			</LinearContainer>
		</section>
	)
}
