import React from 'react'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import {
	HeroSection,
	ProfessionSection,
	FeedbackSection,
} from '@/components/features/homepage'
import { SITE_INFO } from '@/constants/homepage'

const ActivitySection = dynamic(
	() => import('@/components/features/homepage/ActivitySection'),
	{
		loading: () => (
			<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
		),
	},
)

const ImpactSection = dynamic(
	() => import('@/components/features/homepage/ImpactSection'),
	{
		loading: () => (
			<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-64" />
		),
	},
)

const ContactSection = dynamic(
	() => import('@/components/features/homepage/ContactSection'),
	{
		loading: () => (
			<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
		),
	},
)

const GallerySection = dynamic(
	() => import('@/components/features/homepage/GallerySection'),
	{
		loading: () => (
			<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-64" />
		),
	},
)

const CTASection = dynamic(
	() => import('@/components/features/homepage/CTASection'),
	{
		loading: () => (
			<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-48" />
		),
	},
)

export const metadata: Metadata = {
	title: `${SITE_INFO.title} - ${SITE_INFO.subtitle}`,
	description: SITE_INFO.description,
	keywords: [
		'키다리선생님',
		'전문직',
		'봉사동아리',
		'진로교육',
		'고등학생',
		'직업탐방',
	],
	openGraph: {
		title: `${SITE_INFO.title} - ${SITE_INFO.subtitle}`,
		description: SITE_INFO.description,
		type: 'website',
		locale: 'ko_KR',
	},
	robots: {
		index: true,
		follow: true,
	},
}

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-5" />

			{/* Smooth transition area */}
			<div className="relative h-4 bg-gradient-to-b from-white/20 to-transparent dark:from-gray-900/20 pointer-events-none" />

			{/* Main Content */}
			<main>
				<HeroSection />
				<ProfessionSection />
				<FeedbackSection />
				<ActivitySection />
				<ImpactSection />
				<ContactSection />
				<GallerySection />
				<CTASection />
			</main>
		</div>
	)
}
