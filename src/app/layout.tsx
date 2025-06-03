import type { Metadata } from 'next'
import './globals.css'
import React from 'react'
import ClientLayout from '@/components/ClientLayout'

const geistSans = {
	variable: '--font-geist-sans',
	className: 'font-sans',
}

const geistMono = {
	variable: '--font-geist-mono',
	className: 'font-mono',
}

export const metadata: Metadata = {
	title: '키다리 선생님',
	description: '전문직 봉사 동아리',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	)
}
