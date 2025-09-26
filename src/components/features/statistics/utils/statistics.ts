import type { ZodType } from '@/types'
import { VolunteerActivityStatisticsListSchema } from '@/schemas/statistics'
import { TZDate } from '@date-fns/tz'
import { ActivityChange } from '@/components/features/statistics/utils/types'

export const getTotalStatistics = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
) => {
	return {
		activities: data.length,
		participants: [...new Set(data.flatMap((item) => item.participants))]
			.length,
		locations: [...new Set(data.map((item) => item.location))].length,
	}
}

export const getThisMonthStatistics = (params: {
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>
	now: TZDate
	currentMonth: number
}) => {
	/* functions */
	const getChangePercentage = (current: number, previous: number) => {
		return previous > 0 ? ((current - previous) / previous) * 100 : 0
	}

	const getActivitiesChangeCount = (activityCount: {
		thisMonth: number
		lastMonth: number
	}) => {
		return getChangePercentage(activityCount.lastMonth, activityCount.thisMonth)
	}

	const getParticipantsChange = (activities: ActivityChange) => {
		const participants = {
			thisMonth: [
				...new Set(activities.thisMonth.flatMap((item) => item.participants)),
			].length,
			lastMonth: [
				...new Set(activities.lastMonth.flatMap((item) => item.participants)),
			].length,
		}
		return getChangePercentage(participants.lastMonth, participants.thisMonth)
	}

	const getLocationsChange = (activities: ActivityChange) => {
		const participants = {
			thisMonth: [
				...new Set(activities.thisMonth.flatMap((item) => item.location)),
			].length,
			lastMonth: [
				...new Set(activities.lastMonth.flatMap((item) => item.location)),
			].length,
		}
		return getChangePercentage(participants.lastMonth, participants.thisMonth)
	}

	/* main */
	const currentYear = params.now.getFullYear()

	const activities: ActivityChange = {
		thisMonth: params.data.filter(
			(item) => item.month === params.currentMonth && item.year === currentYear,
		),
		lastMonth: params.data.filter(
			(item) =>
				item.month === params.currentMonth - 1 && item.year === currentYear,
		),
	}
	const activityCount = {
		thisMonth: activities.thisMonth.length,
		lastMonth: activities.lastMonth.length,
	}
	const monthlyChange = {
		activity: getActivitiesChangeCount(activityCount),
		participant: getParticipantsChange(activities),
		location: getLocationsChange(activities),
	}

	return {
		activityCount,
		monthlyChange,
	}
}

export const getCategoryStatistics = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
	year?: number,
) => {
	const filteredData = filterDataByYear(data, year)
	return filteredData.reduce((acc: Record<string, number>, item) => {
		acc[item.category] = (acc[item.category] || 0) + 1
		return acc
	}, {})
}

export const getMonthlyTrend = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
	now: TZDate,
	year?: number,
) => {
	const monthlyStats: Record<string, number> = {}

	if (year) {
		for (let month = 1; month <= 12; month++) {
			const monthLabel = `${month}월`
			const count = data.filter(
				(item) => item.year === year && item.month === month,
			).length
			monthlyStats[monthLabel] = count
		}
	} else {
		for (let i = 5; i >= 0; i--) {
			const date = new TZDate(now)
			date.setMonth(date.getMonth() - i)

			const monthLabel = `${date.getMonth() + 1}월`
			const count = data.filter(
				(item) =>
					item.year === date.getFullYear() &&
					item.month === date.getMonth() + 1,
			).length
			monthlyStats[monthLabel] = count
		}
	}

	return Object.entries(monthlyStats).map(([month, activities]) => ({
		month,
		activities,
	}))
}

export const getMonthlyChangeWord = (monthlyChange: number) => {
	return monthlyChange >= 0 ? 'increase' : 'decrease'
}

export const getAvailableYears = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
): number[] => {
	const years = [...new Set(data.map((item) => item.year))]
	return years.sort((a, b) => b - a)
}

export const filterDataByYear = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
	year?: number,
) => {
	if (!year) {
		return data
	}
	return data.filter((item) => item.year === year)
}
