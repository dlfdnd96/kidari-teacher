'use client'

import {
	forwardRef,
	type HTMLAttributes,
	type KeyboardEvent,
	useCallback,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linearTagVariants = cva(
	[
		'inline-flex items-center justify-center whitespace-nowrap font-medium select-none',
		'transition-all duration-150 ease-out hover:scale-105 active:scale-95',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
	],
	{
		variants: {
			variant: {
				default: [
					'bg-[#1A1D29] text-[#8A8F98] border border-[#2D2E37]',
					'hover:bg-[#2D2E37] hover:text-[#F7F8F8]',
				],
				primary: [
					'bg-[#E6E6E6]/10 text-[#E6E6E6] border border-[#E6E6E6]/20',
					'hover:bg-[#E6E6E6]/20 hover:text-white',
				],
				secondary: [
					'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20',
					'hover:bg-[#4CAF50]/20',
				],
				accent: [
					'bg-[#2196F3]/10 text-[#2196F3] border border-[#2196F3]/20',
					'hover:bg-[#2196F3]/20',
				],
			},
			size: {
				sm: 'h-6 px-2 text-xs rounded-md',
				default: 'h-7 px-3 text-xs rounded-lg',
				lg: 'h-8 px-4 text-sm rounded-lg',
				xl: 'h-12 px-6 text-lg rounded-xl',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

const SPACING_CLASSES = {
	tight: 'gap-1',
	normal: 'gap-2',
	loose: 'gap-3',
} as const

export type TagItem = {
	id: string
	label: string
	count?: number
	variant?: VariantProps<typeof linearTagVariants>['variant']
	size?: VariantProps<typeof linearTagVariants>['size']
}

export interface LinearTagProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof linearTagVariants> {
	label: string
	count?: number
}

const LinearTag = forwardRef<HTMLSpanElement, LinearTagProps>(
	({ className, variant, size, label, count, ...props }, ref) => {
		return (
			<span
				className={cn(linearTagVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{label}
				{count !== undefined && (
					<span className="ml-1 opacity-70">({count})</span>
				)}
			</span>
		)
	},
)

LinearTag.displayName = 'LinearTag'

export interface LinearTagCloudProps extends HTMLAttributes<HTMLDivElement> {
	tags: TagItem[]
	onTagClick?: (tag: Pick<TagItem, 'id' | 'label' | 'count'>) => void
	spacing?: keyof typeof SPACING_CLASSES
}

const TagCloud = forwardRef<HTMLDivElement, LinearTagCloudProps>(
	({ className, tags, onTagClick, spacing = 'normal', ...props }, ref) => {
		const handleTagClick = useCallback(
			(tag: TagItem) => {
				if (onTagClick) {
					onTagClick({
						id: tag.id,
						label: tag.label,
						count: tag.count,
					})
				}
			},
			[onTagClick],
		)

		const handleTagKeyDown = useCallback(
			(event: KeyboardEvent<HTMLSpanElement>, tag: TagItem) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					handleTagClick(tag)
				}
			},
			[handleTagClick],
		)

		return (
			<div
				className={cn(
					'flex flex-wrap items-center',
					SPACING_CLASSES[spacing],
					className,
				)}
				ref={ref}
				{...props}
			>
				{tags.map((tag) => (
					<LinearTag
						key={tag.id}
						label={tag.label}
						count={tag.count}
						variant={tag.variant}
						size={tag.size}
						className={onTagClick ? 'cursor-pointer' : undefined}
						role={onTagClick ? 'button' : undefined}
						tabIndex={onTagClick ? 0 : undefined}
						onClick={onTagClick ? () => handleTagClick(tag) : undefined}
						onKeyDown={onTagClick ? (e) => handleTagKeyDown(e, tag) : undefined}
						aria-label={onTagClick ? `태그 ${tag.label} 선택` : undefined}
					/>
				))}
			</div>
		)
	},
)

TagCloud.displayName = 'TagCloud'

export { LinearTag, TagCloud, linearTagVariants }
