import * as z from 'zod/mini'
import { Hero } from '@/components/ui/linear/hero'
import { handleEmailContact } from '@/utils/email'
import { BRAND_INFO } from '@/constants/landing'

export function HeroSection() {
	const email = z.email().parse(process.env.NEXT_PUBLIC_CONTACT_EMAIL)

	return (
		<Hero
			animated={true}
			title={BRAND_INFO.NAME}
			subtitle={BRAND_INFO.SUBTITLE}
			description={BRAND_INFO.DESCRIPTION}
			primaryAction={{
				label: '문의하기',
				onClick: () => handleEmailContact(email),
			}}
			height="full"
		/>
	)
}
