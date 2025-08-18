'use client'

import React from 'react'
import { LinearH4 } from '@/components/ui/linear/linear-typography'
import { LinearTestimonials } from '@/components/ui/linear/linear-testimonials'
import { SCHOOL_FEEDBACKS } from '@/constants/landing'

export function SchoolFeedbackSection() {
	return (
		<section className="py-20 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<LinearH4 className="text-2xl font-semibold text-center">
						현장 반응
					</LinearH4>
				</div>

				{/* Testimonials Grid */}
				<LinearTestimonials
					testimonials={SCHOOL_FEEDBACKS}
					columns={3}
					variant="default"
				/>
			</div>
		</section>
	)
}
