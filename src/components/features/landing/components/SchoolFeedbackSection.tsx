'use client'

import React, { memo } from 'react'
import { Quote } from 'lucide-react'
import { SCHOOL_FEEDBACKS } from '@/constants/landing'
import { Card } from '@/components/ui/card'

const Testimonial = memo(() => {
	return (
		<section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{SCHOOL_FEEDBACKS.map((testimonial, index) => (
				<article key={testimonial.id}>
					<Card className="group h-full p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-slate-100">
						<div className="relative p-6 h-full flex flex-col">
							<div className="mb-4">
								<Quote className="w-6 h-6 text-white/40" aria-hidden="true" />
							</div>
							<blockquote
								className="flex-grow mb-6"
								role="blockquote"
								aria-label={`추천사 ${index + 1}번`}
							>
								<p className="text-white/90 leading-relaxed text-base md:text-base">
									{testimonial.quote}
								</p>
							</blockquote>
						</div>
					</Card>
				</article>
			))}
		</section>
	)
})

Testimonial.displayName = 'Testimonial'

export function SchoolFeedbackSection() {
	return (
		<section className="py-20 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<h3 className="text-2xl font-semibold text-center leading-relaxed tracking-tight text-slate-50">
						현장 반응
					</h3>
				</div>

				<Testimonial />
			</div>
		</section>
	)
}
