import { useStatisticsData } from '@/components/features/statistics/hooks/useStatisticsData'

export function Statistics() {
	const { data: statisticsData, isLoading, isError } = useStatisticsData()
	return <div></div>
}
