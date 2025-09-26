import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'

export function useStatisticsData() {
	const trpc = useTRPC()
	return useQuery(
		trpc.statistics.fetch.queryOptions(undefined, {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		}),
	)
}
