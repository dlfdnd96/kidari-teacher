'use client'

import React, { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_STATUS = 'Active'
const DEFAULT_CTA = 'Explore →'
const DEFAULT_COL_SPAN = 'col-span-1'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				[
					'p-5 rounded-xl',
					'border border-white/10 bg-white/[0.04] backdrop-blur-md',
					'text-slate-100',
				],
				className,
			)}
			{...props}
		/>
	),
)
Card.displayName = 'Card'

const LinearCardHeader = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('relative flex flex-col space-y-1.5 pb-4', className)}
		{...props}
	/>
))
LinearCardHeader.displayName = 'LinearCardHeader'

const LinearCardTitle = forwardRef<
	HTMLHeadingElement,
	HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'font-medium text-slate-100 tracking-tight text-[15px]',
			className,
		)}
		{...props}
	/>
))
LinearCardTitle.displayName = 'LinearCardTitle'

const LinearCardDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('text-sm text-slate-400 leading-snug font-[425]', className)}
		{...props}
	/>
))
LinearCardDescription.displayName = 'LinearCardDescription'

const LinearCardContent = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('relative pt-0', className)} {...props} />
))
LinearCardContent.displayName = 'LinearCardContent'

const LinearCardFooter = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex items-center pt-4', className)}
		{...props}
	/>
))
LinearCardFooter.displayName = 'LinearCardFooter'

export interface BentoItem {
	id?: string
	title: string
	description: string
	icon: React.ReactNode
	status?: string
	tags?: string[]
	meta?: string
	cta?: string
	colSpan?: number
}

interface BentoGridProps {
	items: BentoItem[]
}

function BentoGrid({ items }: BentoGridProps) {
	return (
		<div
			className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto"
			role="grid"
		>
			{items.map((item, index) => {
				const itemKey = item.id ?? `${item.title}-${index}`
				const colSpanClass = item.colSpan ?? DEFAULT_COL_SPAN
				const mdColSpanClass = item.colSpan === 2 ? 'md:col-span-2' : ''

				return (
					<Card
						key={itemKey}
						className={cn(colSpanClass, mdColSpanClass)}
						role="gridcell"
						tabIndex={0}
						aria-label={`${item.title}: ${item.description}`}
					>
						<LinearCardContent className="flex flex-col space-y-3">
							<div className="flex items-center justify-between">
								<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
									{item.icon}
								</div>
								<span className="text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm bg-white/10 text-slate-400">
									{item.status ?? DEFAULT_STATUS}
								</span>
							</div>

							<div className="space-y-2">
								<LinearCardTitle>
									{item.title}
									{item.meta && (
										<span className="ml-2 text-xs text-slate-400 font-normal">
											{item.meta}
										</span>
									)}
								</LinearCardTitle>
								<LinearCardDescription>
									{item.description}
								</LinearCardDescription>
							</div>

							<div className="flex items-center justify-between mt-2">
								<div className="flex items-center space-x-2 text-xs text-slate-400">
									{item.tags?.map((tag, tagIndex) => (
										<span
											key={`${itemKey}-tag-${tagIndex}`}
											className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm"
										>
											#{tag}
										</span>
									))}
								</div>
								<span className="text-xs text-slate-400">
									{item.cta ?? DEFAULT_CTA}
								</span>
							</div>
						</LinearCardContent>
					</Card>
				)
			})}
		</div>
	)
}

export {
	Card,
	LinearCardHeader,
	LinearCardFooter,
	LinearCardTitle,
	LinearCardDescription,
	LinearCardContent,
	BentoGrid,
}
