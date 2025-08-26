'use client'

import React, {
	forwardRef,
	type HTMLAttributes,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface LinearCarouselProps extends HTMLAttributes<HTMLDivElement> {
	items: NonNullable<React.ReactNode>[]
	autoPlay?: boolean
	autoPlayDelay?: number
	showDots?: boolean
	showArrows?: boolean
	itemsPerView?: number
	gap?: number
}

const NAVIGATION_KEYS = {
	ARROW_LEFT: 'ArrowLeft',
	ARROW_RIGHT: 'ArrowRight',
	HOME: 'Home',
	END: 'End',
} as const

const DEFAULT_PROPS = {
	autoPlay: false,
	autoPlayDelay: 3000,
	showDots: true,
	showArrows: true,
	itemsPerView: 1,
	gap: 16,
} as const

const Carousel = forwardRef<HTMLDivElement, LinearCarouselProps>(
	(
		{
			className,
			items,
			autoPlay = DEFAULT_PROPS.autoPlay,
			autoPlayDelay = DEFAULT_PROPS.autoPlayDelay,
			showDots = DEFAULT_PROPS.showDots,
			showArrows = DEFAULT_PROPS.showArrows,
			itemsPerView = DEFAULT_PROPS.itemsPerView,
			gap = DEFAULT_PROPS.gap,
			...props
		},
		ref,
	) => {
		const [currentIndex, setCurrentIndex] = useState(0)
		const [isHovered, setIsHovered] = useState(false)

		const totalSlides = useMemo(
			() => Math.ceil(items.length / itemsPerView),
			[items.length, itemsPerView],
		)

		const slideIndices = useMemo(
			() => Array.from({ length: totalSlides }, (_, i) => i),
			[totalSlides],
		)

		const goToSlide = useCallback(
			(index: number) => {
				setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
			},
			[totalSlides],
		)

		const goToPrevious = useCallback(() => {
			setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
		}, [totalSlides])

		const goToNext = useCallback(() => {
			setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
		}, [totalSlides])

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLDivElement>) => {
				switch (event.key) {
					case NAVIGATION_KEYS.ARROW_LEFT:
						event.preventDefault()
						goToPrevious()
						break
					case NAVIGATION_KEYS.ARROW_RIGHT:
						event.preventDefault()
						goToNext()
						break
					case NAVIGATION_KEYS.HOME:
						event.preventDefault()
						goToSlide(0)
						break
					case NAVIGATION_KEYS.END:
						event.preventDefault()
						goToSlide(totalSlides - 1)
						break
				}
			},
			[goToPrevious, goToNext, goToSlide, totalSlides],
		)

		useEffect(() => {
			if (autoPlay && !isHovered && totalSlides > 1) {
				const timer = setInterval(goToNext, autoPlayDelay)
				return () => clearInterval(timer)
			}
		}, [autoPlay, autoPlayDelay, goToNext, isHovered, totalSlides])

		const translateX = useMemo(() => -currentIndex * 100, [currentIndex])

		const slideStyle = useMemo(
			() => ({
				transform: `translateX(${translateX}%)`,
				gap: `${gap}px`,
			}),
			[translateX, gap],
		)

		const itemStyle = useMemo(
			() => ({
				gap: `${gap}px`,
			}),
			[gap],
		)

		if (!items || items.length === 0) {
			return (
				<div ref={ref} className={cn('relative w-full', className)} {...props}>
					<div className="flex items-center justify-center p-8 text-gray-500">
						표시할 아이템이 없습니다
					</div>
				</div>
			)
		}

		return (
			<div
				ref={ref}
				className={cn('relative w-full group', className)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="region"
				aria-label="이미지 캐러셀"
				aria-live="polite"
				aria-atomic="false"
				{...props}
			>
				<div className="overflow-hidden rounded-lg">
					<div
						className="flex transition-transform duration-300 ease-out"
						style={slideStyle}
						role="group"
						aria-label={`${totalSlides}개 슬라이드 중 ${currentIndex + 1}번째`}
					>
						{slideIndices.map((slideIndex) => {
							const startIndex = slideIndex * itemsPerView
							const endIndex = Math.min(startIndex + itemsPerView, items.length)
							const slideItems = items.slice(startIndex, endIndex)

							return (
								<div
									key={slideIndex}
									className="flex-none w-full flex"
									style={itemStyle}
									role="group"
									aria-label={`슬라이드 ${slideIndex + 1}`}
								>
									{slideItems.map((item, itemIndex) => (
										<div
											key={`${slideIndex}-${itemIndex}`}
											className={cn(
												'flex-1',
												itemsPerView === 1 ? 'w-full' : 'flex-shrink-0',
											)}
											style={
												itemsPerView > 1
													? {
															width: `calc(${100 / itemsPerView}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`,
														}
													: undefined
											}
										>
											{item}
										</div>
									))}
								</div>
							)
						})}
					</div>
				</div>

				{showArrows && totalSlides > 1 && (
					<>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								'absolute left-2 top-1/2 -translate-y-1/2 z-10',
								'bg-black/20 backdrop-blur-sm hover:bg-black/40',
								'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
								'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50',
							)}
							onClick={goToPrevious}
							aria-label="이전 슬라이드로 이동"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								'absolute right-2 top-1/2 -translate-y-1/2 z-10',
								'bg-black/20 backdrop-blur-sm hover:bg-black/40',
								'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
								'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50',
							)}
							onClick={goToNext}
							aria-label="다음 슬라이드로 이동"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</Button>
					</>
				)}

				{showDots && totalSlides > 1 && (
					<div
						className="flex justify-center mt-4 space-x-2"
						role="tablist"
						aria-label="슬라이드 네비게이션"
					>
						{slideIndices.map((index) => (
							<button
								key={index}
								role="tab"
								aria-selected={currentIndex === index}
								aria-controls={`slide-${index}`}
								className={cn(
									'w-2 h-2 rounded-full transition-all duration-200',
									'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
									currentIndex === index
										? 'bg-[#F7F8F8] w-6'
										: 'bg-white/30 hover:bg-white/50',
								)}
								onClick={() => goToSlide(index)}
								aria-label={`${index + 1}번째 슬라이드로 이동`}
							/>
						))}
					</div>
				)}
			</div>
		)
	},
)

Carousel.displayName = 'Carousel'

const LinearCarouselItem = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('flex-none w-full', className)} {...props} />
))

LinearCarouselItem.displayName = 'LinearCarouselItem'

export { Carousel, LinearCarouselItem }
