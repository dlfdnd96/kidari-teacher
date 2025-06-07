'use client'

import React, { Suspense } from 'react'
import { SessionProvider } from 'next-auth/react'
import { TrpcProvider } from '@/components/providers/TrpcProvider'
import { ErrorModalProvider } from '@/components/common/ErrorModal/ErrorModalContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function PageLoading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="text-center">
				<div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
			</div>
		</div>
	)
}

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SessionProvider
			basePath="/api/auth"
			refetchInterval={5 * 60}
			refetchOnWindowFocus={true}
		>
			<TrpcProvider>
				<ErrorModalProvider>
					<div className="flex flex-col min-h-screen">
						<Suspense
							fallback={<div className="h-16 bg-white dark:bg-gray-900" />}
						>
							<Navbar />
						</Suspense>

						<main className="flex-1">
							<Suspense fallback={<PageLoading />}>{children}</Suspense>
						</main>

						<Suspense
							fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800" />}
						>
							<Footer />
						</Suspense>
					</div>
				</ErrorModalProvider>
			</TrpcProvider>
		</SessionProvider>
	)
}
