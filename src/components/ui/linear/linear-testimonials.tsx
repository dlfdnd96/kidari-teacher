'use client'

import React, { forwardRef, type HTMLAttributes, useMemo } from 'react'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LinearCard, LinearCardContent } from './linear-card'
import { LinearText } from './linear-typography'
import type { TestimonialItem } from '@/types/landing'

const GRID_CLASSES = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 md:grid-cols-2',
	3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
} as const

type ColumnType = keyof typeof GRID_CLASSES
type VariantType = 'default' | 'card' | 'minimal'

interface LinearTestimonialsProps extends HTMLAttributes<HTMLDivElement> {
	testimonials: TestimonialItem[]
	columns?: ColumnType
	variant?: VariantType
}

const LinearTestimonials = forwardRef<HTMLDivElement, LinearTestimonialsProps>(
	(
		{ className, testimonials, columns = 3, variant = 'default', ...props },
		ref,
	) => {
		const validatedTestimonials = useMemo(() => {
			if (!Array.isArray(testimonials)) {
				console.warn('LinearTestimonials: testimonials prop must be an array')
				return []
			}
			return testimonials.filter(
				(testimonial) =>
					testimonial &&
					testimonial.id &&
					testimonial.quote &&
					testimonial.quote.trim() !== '',
			)
		}, [testimonials])

		if (validatedTestimonials.length === 0) {
			return (
				<div ref={ref} className={cn('text-center py-8', className)} {...props}>
					<LinearText className="text-white/60">추천사가 없습니다</LinearText>
				</div>
			)
		}

		if (variant === 'minimal') {
			return (
				<section ref={ref} className={cn('space-y-8', className)} {...props}>
					{validatedTestimonials.map((testimonial, index) => (
						<article
							key={testimonial.id}
							className="text-center max-w-3xl mx-auto"
						>
							<Quote
								className="w-8 h-8 text-white/20 mx-auto mb-6"
								aria-hidden="true"
							/>
							<blockquote
								className="text-xl md:text-2xl text-white/90 font-light mb-6 leading-relaxed"
								role="blockquote"
								aria-label={`추천사 ${index + 1}번`}
							>
								{testimonial.quote}
							</blockquote>
						</article>
					))}
				</section>
			)
		}

		return (
			<section
				ref={ref}
				className={cn('grid gap-6', GRID_CLASSES[columns], className)}
				{...props}
			>
				{validatedTestimonials.map((testimonial, index) => (
					<TestimonialCard
						key={testimonial.id}
						testimonial={testimonial}
						index={index}
					/>
				))}
			</section>
		)
	},
)

LinearTestimonials.displayName = 'LinearTestimonials'

interface TestimonialCardProps {
	testimonial: TestimonialItem
	index: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
	testimonial,
	index,
}) => {
	return (
		<article>
			<LinearCard className="group h-full">
				<LinearCardContent className="p-6 h-full flex flex-col">
					<div className="mb-4">
						<Quote className="w-6 h-6 text-white/40" aria-hidden="true" />
					</div>
					<blockquote
						className="flex-grow mb-6"
						role="blockquote"
						aria-label={`추천사 ${index + 1}번`}
					>
						<LinearText className="text-white/90 leading-relaxed text-base md:text-base">
							{testimonial.quote}
						</LinearText>
					</blockquote>
				</LinearCardContent>
			</LinearCard>
		</article>
	)
}

const LinearTestimonialCard = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		testimonial: TestimonialItem
	}
>(({ className, testimonial, ...props }, ref) => {
	if (!testimonial || !testimonial.quote || testimonial.quote.trim() === '') {
		return null
	}

	return (
		<article ref={ref} className={className} {...props}>
			<LinearCard className="group h-full">
				<LinearCardContent className="p-6 h-full flex flex-col">
					<div className="mb-4">
						<Quote className="w-6 h-6 text-white/40" aria-hidden="true" />
					</div>
					<blockquote className="flex-grow mb-6" role="blockquote">
						<LinearText className="text-white/90 leading-relaxed text-base md:text-lg">
							{testimonial.quote}
						</LinearText>
					</blockquote>
				</LinearCardContent>
			</LinearCard>
		</article>
	)
})

LinearTestimonialCard.displayName = 'LinearTestimonialCard'

export { LinearTestimonials, LinearTestimonialCard }
