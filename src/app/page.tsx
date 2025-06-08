import React, { Suspense } from 'react'
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
			<div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6"></div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
						<div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-96"></div>
						<div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-96"></div>
					</div>
				</div>
			</div>
		),
	},
)

const ImpactSection = dynamic(
	() => import('@/components/features/homepage/ImpactSection'),
	{
		loading: () => (
			<div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-6"></div>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-40"
							></div>
						))}
					</div>
				</div>
			</div>
		),
	},
)

const ContactSection = dynamic(
	() => import('@/components/features/homepage/ContactSection'),
	{
		loading: () => (
			<div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96"></div>
			</div>
		),
	},
)

const GallerySection = dynamic(
	() => import('@/components/features/homepage/GallerySection'),
	{
		loading: () => (
			<div className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-6"></div>
					<div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-64 mb-6"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-64"></div>
						<div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-64"></div>
					</div>
				</div>
			</div>
		),
	},
)

const CTASection = dynamic(
	() => import('@/components/features/homepage/CTASection'),
	{
		loading: () => (
			<div className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-8">
				<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-48"></div>
			</div>
		),
	},
)

const structuredData = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: '키다리 선생님',
	description: '전문직 봉사 동아리 - 고등학생 진로교육을 위한 전문가 멘토링',
	url: process.env.NEXTAUTH_URL,
	logo: `${process.env.NEXTAUTH_URL}/images/main/logo.png`,
	contactPoint: {
		'@type': 'ContactPoint',
		email: SITE_INFO.email,
		contactType: 'customer service',
	},
	sameAs: [SITE_INFO.cafeUrl],
}

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
		'멘토링',
		'진로상담',
	],
	openGraph: {
		title: `${SITE_INFO.title} - ${SITE_INFO.subtitle}`,
		description: SITE_INFO.description,
		type: 'website',
		locale: 'ko_KR',
		url: process.env.NEXTAUTH_URL,
		siteName: SITE_INFO.title,
		images: [
			{
				url: '/images/main/logo.png',
				width: 1200,
				height: 630,
				alt: SITE_INFO.logoAlt,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: process.env.NEXTAUTH_URL,
	},
}

export default function HomePage() {
	return (
		<>
			{/* 구조화된 데이터 */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden pt-16">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-grid-white/10 bg-size-[20px_20px] opacity-5" />

				{/* Smooth transition area */}
				<div className="relative h-4 bg-linear-to-b from-white/20 to-transparent dark:from-gray-900/20 pointer-events-none" />

				{/* Main Content */}
				<main>
					{/* 즉시 로드되는 핵심 섹션들 */}
					<HeroSection />
					<ProfessionSection />
					<FeedbackSection />

					{/* 지연 로드되는 섹션들 - Suspense로 래핑 */}
					<Suspense
						fallback={
							<div className="max-w-5xl mx-auto mb-12 px-4">
								<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
							</div>
						}
					>
						<ActivitySection />
					</Suspense>

					<Suspense
						fallback={
							<div className="max-w-5xl mx-auto mb-12 px-4">
								<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-64" />
							</div>
						}
					>
						<ImpactSection />
					</Suspense>

					<Suspense
						fallback={
							<div className="max-w-5xl mx-auto mb-12 px-4">
								<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
							</div>
						}
					>
						<ContactSection />
					</Suspense>

					<Suspense
						fallback={
							<div className="max-w-6xl mx-auto mb-12 px-4">
								<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-64" />
							</div>
						}
					>
						<GallerySection />
					</Suspense>

					<Suspense
						fallback={
							<div className="max-w-4xl mx-auto mb-12 px-4">
								<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-48" />
							</div>
						}
					>
						<CTASection />
					</Suspense>
				</main>
			</div>
		</>
	)
}
