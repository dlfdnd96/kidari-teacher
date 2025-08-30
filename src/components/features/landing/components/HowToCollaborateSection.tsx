'use client'

import React, {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { COLLABORATION_STEPS, SECTION_IDS } from '@/constants/landing'
import { motion, useScroll, useTransform } from 'framer-motion'

export interface TimelineEntry {
	id?: string
	title: string
	content: React.ReactNode
	date?: string
}

interface TimelineProps {
	data: TimelineEntry[]
	className?: string
}

const Timeline = React.memo(({ data, className }: TimelineProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState(0)

	const updateHeight = useCallback(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect()
			setHeight(rect.height)
		}
	}, [])

	useLayoutEffect(() => {
		updateHeight()

		const resizeObserver = new ResizeObserver(updateHeight)
		if (ref.current) {
			resizeObserver.observe(ref.current)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [updateHeight])

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start center', 'end center'],
	})

	const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
	const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

	const timelineItems = useMemo(
		() =>
			data.map((item, index) => (
				<li
					key={item.id || `timeline-item-${index}`}
					className="flex justify-start pt-10 md:pt-40 md:gap-32 md:items-center"
					role="listitem"
					aria-label={`타임라인 항목 ${index + 1}: ${item.title}`}
				>
					<div className="relative flex flex-col md:flex-row z-40 items-center self-start max-w-xs lg:max-w-sm md:w-full">
						<div
							className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-[#08090A] flex items-center justify-center"
							aria-hidden="true"
						>
							<div className="h-4 w-4 rounded-full bg-[#E6E6E6]" />
						</div>
						<h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-[#E6E6E6] whitespace-nowrap">
							{item.title}
						</h3>
						{item.date && (
							<time
								className="hidden md:block text-sm text-gray-400 md:pl-4"
								dateTime={item.date}
							>
								{item.date}
							</time>
						)}
					</div>

					<div className="relative pl-20 pr-4 md:pl-8 w-full flex flex-col justify-center">
						<h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-[#E6E6E6]">
							{item.title}
						</h3>
						{item.date && (
							<time
								className="md:hidden block text-sm text-gray-400 mb-2"
								dateTime={item.date}
							>
								{item.date}
							</time>
						)}
						<div role="region" aria-label={`${item.title} 내용`}>
							{item.content}
						</div>
					</div>
				</li>
			)),
		[data],
	)

	return (
		<section
			className={`w-full bg-transparent font-sans md:px-10 ${className || ''}`}
			ref={containerRef}
			role="region"
			aria-label="타임라인"
		>
			<div ref={ref} className="relative max-w-7xl mx-auto pb-20">
				<ol className="list-none p-0 m-0" role="list">
					{timelineItems}
				</ol>
				<div
					style={{
						height: `${height}px`,
					}}
					className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/20 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
					aria-hidden="true"
					role="presentation"
				>
					<motion.div
						style={{
							height: heightTransform,
							opacity: opacityTransform,
						}}
						className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
						aria-hidden="true"
					/>
				</div>
			</div>
		</section>
	)
})

Timeline.displayName = 'Timeline'

export function HowToCollaborateSection() {
	return (
		<section id={SECTION_IDS.COLLABORATION} className="py-20 px-4 relative">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-relaxed">
						협의 방법
					</h2>
				</div>

				{/* Collaboration Process */}
				<Timeline
					data={COLLABORATION_STEPS.map((step) => {
						return {
							title: step.title,
							content: (
								<div className="flex items-start">
									<p className="leading-relaxed text-gray-300 text-lg">
										{step.description}
									</p>
								</div>
							),
						}
					})}
				/>
			</div>
		</section>
	)
}
