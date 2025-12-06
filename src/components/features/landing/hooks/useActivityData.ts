import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'

export function useActivityData() {
	const trpc = useTRPC()
	return useQuery(
		trpc.activity.fetch.queryOptions(undefined, {
			staleTime: 24 * 60 * 60 * 1000, // 1 day
			gcTime: 24 * 60 * 60 * 1000, // 1 day
			retry: 2,
			refetchOnWindowFocus: false,
		}),
	)
}
