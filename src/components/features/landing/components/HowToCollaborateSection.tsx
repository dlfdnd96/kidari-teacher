'use client'

import React from 'react'
import { LinearH2, LinearText } from '@/components/ui/typography'
import { COLLABORATION_STEPS, SECTION_IDS } from '@/constants/landing'
import { Timeline } from '@/components/ui/timeline'

export function HowToCollaborateSection() {
	return (
		<section id={SECTION_IDS.COLLABORATION} className="py-20 px-4 relative">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<LinearH2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
						협의 방법
					</LinearH2>
				</div>

				{/* Collaboration Process */}
				<Timeline
					data={COLLABORATION_STEPS.map((step) => {
						return {
							title: step.title,
							content: (
								<div className="flex items-start">
									<LinearText className="leading-relaxed text-gray-300 text-lg">
										{step.description}
									</LinearText>
								</div>
							),
						}
					})}
				/>
			</div>
		</section>
	)
}
