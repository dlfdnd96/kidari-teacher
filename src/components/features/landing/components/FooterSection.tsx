'use client'

import { Footer } from '@/components/ui/linear/footer'

export function FooterSection() {
	return (
		<Footer
			bottomText={`Copyright © ${new Date().getFullYear()} 키다리 선생님. All rights reserved.`}
		/>
	)
}
