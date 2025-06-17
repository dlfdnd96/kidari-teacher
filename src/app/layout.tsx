import type { Metadata } from 'next'
import '@/app/globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import { Toaster } from '@/components/ui/sonner'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
})

export const metadata: Metadata = {
	title: {
		default: '키다리 선생님',
		template: '%s | 키다리 선생님',
	},
	description: '전문직 봉사 동아리 - 고등학생 진로교육을 위한 전문가 멘토링',
	keywords: [
		'키다리선생님',
		'전문직',
		'봉사동아리',
		'진로교육',
		'고등학생',
		'직업탐방',
	],
	authors: [{ name: '키다리 선생님' }],
	creator: '키다리 선생님',
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		url: 'https://your-domain.com',
		siteName: '키다리 선생님',
		title: '키다리 선생님 - 전문직 봉사 동아리',
		description: '고등학생 진로교육을 위한 전문가 멘토링 서비스',
		images: [
			{
				url: '/images/main/logo.png',
				width: 1200,
				height: 630,
				alt: '키다리 선생님 로고',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: '키다리 선생님',
		description: '전문직 봉사 동아리 - 고등학생 진로교육',
		images: ['/images/main/logo.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ko" className={inter.variable}>
			<body className="font-sans antialiased">
				<ToastProvider>
					<ClientLayout>{children}</ClientLayout>
					<Toaster />
				</ToastProvider>
			</body>
		</html>
	)
}
