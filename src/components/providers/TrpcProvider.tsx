'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import type { AppRouter } from '@/server/routers/_app'
import superjson from 'superjson'
import { TRPCProvider } from '@/utils/trpc'

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient()
	} else {
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient()
		}

		return browserQueryClient
	}
}

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
	const queryClient = getQueryClient()
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
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
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	)
}
