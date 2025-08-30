import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'

export function useStatisticsData() {
	const trpc = useTRPC()
	return useQuery(trpc.statistics.fetch.queryOptions(undefined))
}
