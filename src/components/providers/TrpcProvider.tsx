'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import React, { useState } from 'react'
import type { AppRouter } from '@/server/routers/_app'
import superjson from 'superjson'

export const trpc = createTRPCReact<AppRouter>()

function getBaseUrl() {
	if (typeof window !== 'undefined') {
		return ''
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}
	return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TrpcProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	)

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					transformer: superjson,
					headers() {
						return {
							'Content-Type': 'application/json',
						}
					},
				}),
			],
		}),
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	)
}
