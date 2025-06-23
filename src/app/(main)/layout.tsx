import React from 'react'
import ClientLayout from '@/components/ClientLayout'
import { Toaster } from '@/components/ui'
import { ToastProvider } from '@/contexts/ToastContext'

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ToastProvider>
			<ClientLayout>{children}</ClientLayout>
			<Toaster />
		</ToastProvider>
	)
}
