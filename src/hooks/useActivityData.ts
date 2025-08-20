import { useQuery } from '@tanstack/react-query'
import { ZodType } from '@/shared/types'
import { ActivityRecordSchema } from '@/shared/schemas/landing'

export function useActivityData() {
	return useQuery({
		queryKey: ['activity-data'],
		queryFn: async (): Promise<ZodType<typeof ActivityRecordSchema>> => {
			const response = await fetch('/api/activity-data')
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			return response.json()
		},
		staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
		gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
		retry: 2,
		refetchOnWindowFocus: false,
	})
}
