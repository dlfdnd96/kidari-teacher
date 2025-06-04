// src/components/ClientLayout.tsx
'use client'

import Navbar from '@/components/layout/Navbar'
import { SessionProvider } from 'next-auth/react'
import Footer from '@/components/layout/Footer'
import React from 'react'
import { ErrorModalProvider } from '@/components/common/ErrorModal/ErrorModalContext'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ErrorModalProvider>
			<SessionProvider>
				{/* 전역 네비게이션 */}
				<Navbar />

				{/* 메인 컨텐츠 - Navbar 높이만큼 상단 여백 추가 */}
				<main className="pt-16 min-h-screen">{children}</main>

				{/* 전역 푸터 */}
				<Footer />
			</SessionProvider>
		</ErrorModalProvider>
	)
}
