import { useStatisticsData } from '@/components/features/statistics/hooks/useStatisticsData'
import {
	BarChart,
	EmptyStatistics,
	LineChart,
	PieChart,
	RankingList,
	StatisticsCard,
} from '.'
import { TZDate } from '@date-fns/tz'
import {
	getCategoryStatistics,
	getMonthlyChangeWord,
	getMonthlyTrend,
	getThisMonthStatistics,
	getTotalStatistics,
} from '@/components/features/statistics/utils/statistics'
import {
	createLocationBarChartData,
	createPieChartData,
	createRankingData,
} from '@/components/features/statistics/utils/chart'

interface StatisticsViewParams {
	statistics: {
		total: {
			activities: number
			participants: number
			locations: number
		}
		thisMonthStatistics: {
			activityCount: {
				thisMonth: number
				lastMonth: number
			}
			monthlyChange: {
				activity: number
				participant: number
				location: number
			}
		}
		monthlyTrendData: { month: string; activities: number }[]
		locationBarData: { location: string; count: number }[]
		currentMonth: number
	}
	chart: {
		pieChartData: { name: string; value: number }[]
		locationBarData: { location: string; count: number }[]
		rankingData: {
			id: string
			name: string
			score: number
			location: string
			category: string
			rank: number
		}[]
	}
}

function getStatisticsView({ statistics, chart }: StatisticsViewParams) {
	const metrics = [
		<StatisticsCard
			key="total-activities"
			title="총 봉사활동"
			value={statistics.total.activities}
			change={{
				value: Math.round(
					statistics.thisMonthStatistics.monthlyChange.activity,
				),
				type: getMonthlyChangeWord(
					statistics.thisMonthStatistics.monthlyChange.activity,
				),
			}}
			description="전체 봉사활동 수"
			variant="primary"
		/>,
		<StatisticsCard
			key="total-participants"
			title="총 참여자"
			value={statistics.total.participants}
			change={{
				value: Math.round(
					statistics.thisMonthStatistics.monthlyChange.participant,
				),
				type: getMonthlyChangeWord(
					statistics.thisMonthStatistics.monthlyChange.participant,
				),
			}}
			description="참여자 수"
			variant="primary"
		/>,
		<StatisticsCard
			key="total-locations"
			title="활동 지역"
			value={statistics.total.locations}
			change={{
				value: Math.round(
					statistics.thisMonthStatistics.monthlyChange.location,
				),
				type: getMonthlyChangeWord(
					statistics.thisMonthStatistics.monthlyChange.location,
				),
			}}
			description="봉사활동 지역 수"
			variant="primary"
		/>,
		<StatisticsCard
			key="monthly-activities"
			title="이번 달 활동"
			value={statistics.thisMonthStatistics.activityCount.thisMonth}
			change={{
				value: Math.round(
					statistics.thisMonthStatistics.monthlyChange.activity,
				),
				type: getMonthlyChangeWord(
					statistics.thisMonthStatistics.monthlyChange.activity,
				),
			}}
			description={`${statistics.currentMonth}월 진행된 봉사활동`}
			variant="primary"
		/>,
	]

	const leftSection = []
	if (chart.pieChartData.length > 0) {
		leftSection.push(
			<div
				key="category-analysis"
				className="bg-card rounded-lg border border-primary/20 p-6 h-full"
			>
				<PieChart
					data={chart.pieChartData}
					title="활동 분야별 분석"
					description="봉사활동 카테고리별 분포"
					size="sm"
					className="border-0"
				/>
			</div>,
		)
	}

	const combinedChartsSection = []
	if (
		statistics.monthlyTrendData.length > 0 &&
		statistics.locationBarData.length > 0
	) {
		combinedChartsSection.push(
			<div
				key="combined-charts"
				className="bg-card rounded-lg border border-primary/20 p-6"
			>
				<div className="grid grid-cols-2 gap-6 h-full">
					{/* Line Chart */}
					<div className="h-full">
						<LineChart
							data={statistics.monthlyTrendData}
							xKey="month"
							yKey="activities"
							title="시간에 따른 활동 분석"
							description="월별 봉사활동 참여 추이"
							size="sm"
							formatYAxisLabel={(value) => `${value}회`}
							className="border-0 h-full"
						/>
					</div>
					{/* Bar Chart */}
					<div className="h-full">
						<BarChart
							data={statistics.locationBarData}
							xKey="location"
							yKey="count"
							title="최근 참여 봉사 활동"
							description="활동이 많이 이루어진 상위 지역"
							size="sm"
							formatYAxisLabel={(value) => `${value}회`}
							color="var(--chart-2)"
							className="border-0 h-full"
						/>
					</div>
				</div>
			</div>,
		)
	}

	const rankingSection = []
	if (chart.rankingData.length > 0) {
		rankingSection.push(
			<div key="ranking-list" className="lg:col-span-1">
				<RankingList
					rankings={chart.rankingData}
					title="봉사활동 참여 랭킹"
					maxItems={chart.rankingData.length}
				/>
			</div>,
		)
	}

	return {
		metrics,
		leftSection,
		combinedChartsSection,
		rankingSection,
	}
}

export function Statistics() {
	const { data: allStatisticsData } = useStatisticsData()

	if (!allStatisticsData || allStatisticsData.length === 0) {
		return <EmptyStatistics />
	}

	const now = new TZDate(new Date(), 'Asia/Seoul')
	const currentMonth = now.getMonth() + 1

	// 통계 계산
	const total = getTotalStatistics(allStatisticsData)
	const thisMonthStatistics = getThisMonthStatistics({
		data: allStatisticsData,
		now,
		currentMonth,
	})
	// 카테고리별 통계 계산
	const categoryStats = getCategoryStatistics(allStatisticsData)
	// 월별 추이 데이터 계산
	const monthlyTrendData = getMonthlyTrend(allStatisticsData, now)

	const pieChartData = createPieChartData(categoryStats)
	const locationBarData = createLocationBarChartData(allStatisticsData)
	const rankingData = createRankingData(allStatisticsData, 10)

	const { metrics, leftSection, combinedChartsSection, rankingSection } =
		getStatisticsView({
			statistics: {
				total,
				thisMonthStatistics,
				monthlyTrendData,
				locationBarData,
				currentMonth,
			},
			chart: {
				pieChartData,
				locationBarData,
				rankingData,
			},
		})

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-1">{leftSection}</div>
				<div className="lg:col-span-2">{combinedChartsSection}</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{rankingSection}
			</div>
		</div>
	)
}
