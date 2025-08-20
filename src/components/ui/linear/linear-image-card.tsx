'use client'

import React, { forwardRef, type HTMLAttributes } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
	LinearCard,
	LinearCardContent,
	LinearCardDescription,
	LinearCardFooter,
	LinearCardHeader,
	LinearCardTitle,
} from './linear-card'

type AspectRatio = 'square' | 'video' | 'portrait' | 'wide'
type GapSize = 1 | 2 | 3 | 4 | 5 | 6 | 8

interface LinearImageCardProps extends HTMLAttributes<HTMLDivElement> {
	src: string
	alt: string
	title?: string
	description?: string
	aspectRatio?: AspectRatio
	overlay?: boolean
	footer?: React.ReactNode
	priority?: boolean
	placeholder?: 'blur' | 'empty'
	blurDataURL?: string
}

interface LinearImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 1 | 2 | 3 | 4
	gap?: GapSize
}

interface LinearHeroImageCardProps extends LinearImageCardProps {
	height?: string
}

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
	square: 'aspect-square',
	video: 'aspect-video',
	portrait: 'aspect-[3/4]',
	wide: 'aspect-[21/9]',
}

const GAP_CLASSES: Record<GapSize, string> = {
	1: 'gap-1',
	2: 'gap-2',
	3: 'gap-3',
	4: 'gap-4',
	5: 'gap-5',
	6: 'gap-6',
	8: 'gap-8',
}

const COLUMN_CLASSES = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
} as const

const LinearImageCard = forwardRef<HTMLDivElement, LinearImageCardProps>(
	(
		{
			className,
			src,
			alt,
			title,
			description,
			aspectRatio = 'video',
			overlay = false,
			footer,
			children,
			priority = false,
			placeholder = 'empty',
			blurDataURL,
			...props
		},
		ref,
	) => {
		const imageProps = {
			src,
			alt,
			fill: true,
			className: 'object-cover',
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			priority,
			placeholder,
			...(blurDataURL && { blurDataURL }),
		}

		const renderOverlayContent = () => {
			if (!overlay || (!title && !description)) return null

			return (
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
					{title && (
						<h3 className="text-lg font-medium leading-tight mb-1">{title}</h3>
					)}
					{description && (
						<p className="text-sm text-white/80 line-clamp-2">{description}</p>
					)}
				</div>
			)
		}

		const renderCardContent = () => {
			if (overlay || (!title && !description && !children)) return null

			return (
				<div className="p-5">
					{title && (
						<LinearCardHeader className="p-0 pb-3">
							<LinearCardTitle>{title}</LinearCardTitle>
							{description && (
								<LinearCardDescription>{description}</LinearCardDescription>
							)}
						</LinearCardHeader>
					)}
					{children && (
						<LinearCardContent className="p-0">{children}</LinearCardContent>
					)}
				</div>
			)
		}

		return (
			<LinearCard
				ref={ref}
				className={cn('overflow-hidden p-0', className)}
				{...props}
			>
				<div className={cn('relative', ASPECT_RATIO_CLASSES[aspectRatio])}>
					<Image {...imageProps} />
					{overlay && (
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
					)}
					{renderOverlayContent()}
				</div>
				{renderCardContent()}
				{footer && (
					<LinearCardFooter className="px-5 pb-5">{footer}</LinearCardFooter>
				)}
			</LinearCard>
		)
	},
)

LinearImageCard.displayName = 'LinearImageCard'

const LinearImageGallery = forwardRef<HTMLDivElement, LinearImageGalleryProps>(
	({ className, columns = 3, gap = 4, children, ...props }, ref) => {
		const gridClasses = cn(
			'grid',
			GAP_CLASSES[gap],
			COLUMN_CLASSES[columns],
			{
				'md:grid-cols-2': columns > 2,
				'lg:grid-cols-3': columns === 3,
				'lg:grid-cols-4': columns === 4,
			},
			className,
		)

		return (
			<div ref={ref} className={gridClasses} {...props}>
				{children}
			</div>
		)
	},
)

LinearImageGallery.displayName = 'LinearImageGallery'

const LinearHeroImageCard = forwardRef<
	HTMLDivElement,
	LinearHeroImageCardProps
>(({ className, height = 'h-96', ...props }, ref) => (
	<LinearImageCard
		ref={ref}
		className={cn(height, 'w-full', className)}
		aspectRatio="wide"
		overlay={true}
		{...props}
	/>
))

LinearHeroImageCard.displayName = 'LinearHeroImageCard'

export { LinearImageCard, LinearImageGallery, LinearHeroImageCard }
