import type { ZodType } from '@/types'
import { VolunteerActivityStatisticsListSchema } from '@/schemas/statistics'
import { calculateRank } from '@/utils/rank'

export const createPieChartData = (category: Record<string, number>) => {
	return Object.entries(category).map(([name, value]) => ({
		name,
		value,
	}))
}

export const createLocationBarChartData = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
) => {
	const locationStats = data.reduce((acc: Record<string, number>, item) => {
		acc[item.location] = (acc[item.location] || 0) + 1
		return acc
	}, {})

	return Object.entries(locationStats)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([location, count]) => ({
			location,
			count,
		}))
}

export const createRankingData = (
	data: ZodType<typeof VolunteerActivityStatisticsListSchema>,
	maxItems: number,
) => {
	const participantStats = new Map<
		string,
		{ count: number; activities: Set<string> }
	>()
	data.forEach((activity) => {
		activity.participants.forEach((participant) => {
			if (!participantStats.has(participant)) {
				participantStats.set(participant, { count: 0, activities: new Set() })
			}

			const participantStat = participantStats.get(participant)
			if (!participantStat) {
				return
			}

			participantStat.count += 1
			participantStat.activities.add(activity.serviceName)
		})
	})

	const sortedParticipants = Array.from(participantStats.entries())
		.map(([name, stats]) => ({
			id: name,
			name,
			score: stats.count,
			location: `${stats.activities.size}개 활동 참여`,
			category: '봉사활동',
		}))
		.sort((a, b) => {
			if (b.score === a.score) {
				return a.name.localeCompare(b.name, 'ko-KR')
			}

			return b.score - a.score
		})
	const rankedParticipants = calculateRank(sortedParticipants)
	return rankedParticipants.slice(0, maxItems)
}
