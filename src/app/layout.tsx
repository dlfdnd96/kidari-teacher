import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import React from 'react'
import { TrpcProvider } from '@/components/providers/TrpcProvider'
import { Footer } from '@/components/layout/Footer'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: '키다리 선생님',
	description: '전문직 봉사 동아리',
	icons: {
		icon: '/images/logo.png',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<TrpcProvider>{children}</TrpcProvider>
				<Footer
					bottomText={`Copyright © ${new Date().getFullYear()} 키다리 선생님. All rights reserved.`}
				/>
			</body>
		</html>
	)
}
