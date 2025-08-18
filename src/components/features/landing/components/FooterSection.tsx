'use client'

import { LinearFooter } from '@/components/ui/linear/linear-footer'

export function FooterSection() {
	return (
		<LinearFooter
			bottomText={`Copyright © ${new Date().getFullYear()} 키다리 선생님. All rights reserved.`}
		/>
	)
}
