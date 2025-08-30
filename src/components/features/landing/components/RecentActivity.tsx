import React, {
	JSX,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import * as z from 'zod/mini'
import { ArrowRight } from 'lucide-react'
import { LinearH3, LinearText } from '@/components/ui/linear/typography'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from '@/constants/landing'
import { createDateStringFormat } from '@/utils/date'
import { ZodType } from '@/shared/types'
import {
	ActivityRecordHistorySchema,
	ActivityRecordSchema,
} from '@/shared/schemas/landing'

interface RecentActivitiesTableProps {
	activityData: ZodType<typeof ActivityRecordSchema> | null
}

const escapeHtml = (text: string): string => {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
}

const getLastValidDate = (
	activity: ZodType<typeof ActivityRecordHistorySchema>,
): string | null => {
	if (!activity?.dates.length) {
		return null
	}

	for (let i = activity.dates.length - 1; i >= 0; i--) {
		const dateValue = activity.dates[i]
		if (!dateValue) {
			continue
		}

		const date = z.iso.date().safeParse(dateValue)
		if (date.success) {
			return date.data
		}
	}

	return null
}

const getLastActivityDate = (
	activity: ZodType<typeof ActivityRecordHistorySchema>,
): string => {
	const lastDate = getLastValidDate(activity)
	return lastDate ? createDateStringFormat(lastDate) : 'N/A'
}

const getAllActivityDates = (
	activity: ZodType<typeof ActivityRecordHistorySchema>,
): JSX.Element => {
	if (!activity?.dates.length) {
		return <span className="text-white/60">N/A</span>
	}

	const validDates = activity.dates
		.filter((dateValue) => {
			if (!dateValue) {
				return false
			}

			const date = z.iso.date().safeParse(dateValue)
			return date.success
		})
		.map((dateValue) => createDateStringFormat(dateValue))
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

	if (validDates.length === 0) {
		return <span className="text-white/60">N/A</span>
	}

	if (validDates.length === 1) {
		const lastDate = validDates[0]
		return <span className="text-white/60">{lastDate}</span>
	}

	return (
		<span className="flex flex-col space-y-1">
			{validDates.map((date, index) => (
				<span key={index} className="px-2 py-1 rounded text-white/60">
					{date}
				</span>
			))}
		</span>
	)
}

const generateUniqueKey = (
	activity: ZodType<typeof ActivityRecordHistorySchema>,
	index: number,
): string => {
	return (
		String(activity.id) ||
		`activity-${index}-${activity.school}-${activity.location}-${Date.now()}`
	)
}

const getAvailableYears = (
	activities: ZodType<typeof ActivityRecordHistorySchema>[],
): string[] => {
	const years = new Set<string>()

	activities.forEach((activity) => {
		const lastDate = getLastValidDate(activity)
		if (lastDate) {
			const year = new Date(lastDate).getFullYear().toString()
			years.add(year)
		}
	})

	return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
}

const AllActivities = memo(
	({
		activities,
	}: {
		activities: (ZodType<typeof ActivityRecordHistorySchema> & {
			uniqueKey: string
			lastValidDate: string | null
		})[]
	}) => {
		const [selectedYear, setSelectedYear] = useState<string>('')

		const availableYears = useMemo(() => {
			return getAvailableYears(activities)
		}, [activities])

		useEffect(() => {
			if (availableYears.length > 0 && !selectedYear) {
				setSelectedYear(availableYears[0])
			}
		}, [availableYears, selectedYear])

		const filteredActivities = useMemo(() => {
			return activities.filter((activity) => {
				if (!activity.lastValidDate) {
					return false
				}

				const activityYear = new Date(activity.lastValidDate)
					.getFullYear()
					.toString()
				return activityYear === selectedYear
			})
		}, [activities, selectedYear])

		const handleYearSelect = useCallback((year: string) => {
			setSelectedYear(year)
		}, [])

		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="default"
						size="sm"
						className="flex items-center gap-2 cursor-pointer"
					>
						전체 활동 내역 보기 <ArrowRight className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-[90vw] lg:max-w-4xl h-[80vh] bg-[#0A0B0D] border-[#1C1D20] text-white flex flex-col">
					<DialogHeader className="border-b border-[#1C1D20] pb-4 mb-0 p-6">
						<DialogTitle className="text-xl font-semibold text-[#F7F8F8]">
							전체 봉사활동 내역
						</DialogTitle>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto">
						<div className="mb-4 p-6">
							<div className="flex gap-2 flex-wrap">
								{availableYears.map((year) => (
									<Button
										className="cursor-pointer"
										key={year}
										variant={selectedYear === year ? 'default' : 'secondary'}
										size="sm"
										onClick={() => handleYearSelect(year)}
									>
										{year}년
									</Button>
								))}
							</div>
						</div>

						<div className="px-6">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="sticky top-0 bg-[#08090A] z-10">
										<tr className="border-b border-white/10">
											<th className="text-center py-3 px-4 text-white/70 font-medium">
												학교명
											</th>
											<th className="text-center py-3 px-4 text-white/70 font-medium">
												지역
											</th>
											<th className="text-center py-3 px-4 text-white/70 font-medium">
												활동일
											</th>
											<th className="text-center py-3 px-4 text-white/70 font-medium">
												상태
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredActivities.length > 0 ? (
											filteredActivities.map((activity) => (
												<tr
													key={activity.uniqueKey}
													className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
												>
													<td className="py-3 px-4 text-center">
														<p className="text-sm leading-normal text-slate-50 font-medium">
															{activity.school
																? escapeHtml(activity.school)
																: '정보 없음'}
														</p>
													</td>
													<td className="py-3 px-4 text-center">
														<p className="text-sm leading-normal text-white/80">
															{activity.location
																? escapeHtml(activity.location)
																: '정보 없음'}
														</p>
													</td>
													<td className="py-3 px-4 text-center">
														<p className="text-sm leading-normal text-white/80">
															{getAllActivityDates(activity)}
														</p>
													</td>
													<td className="py-3 px-4 text-center">
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
															{activity.status
																? escapeHtml(activity.status)
																: '알 수 없음'}
														</span>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={4} className="py-8 px-4 text-center">
													<p className="text-sm leading-normal text-white/60">
														{selectedYear}년 활동 내역이 없습니다.
													</p>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button className="cursor-pointer" variant="default">
								닫기
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	},
)

AllActivities.displayName = 'AllActivities'

export function RecentActivity({ activityData }: RecentActivitiesTableProps) {
	const sortedActivities = useMemo(() => {
		if (!activityData?.activities.length) {
			return []
		}

		const completedHighSchoolActivities = activityData.activities.filter(
			(activity) =>
				activity.status === ACTIVITY_STATUS.COMPLETED &&
				activity.type === ACTIVITY_TYPE.HIGH_SCHOOL,
		)

		return completedHighSchoolActivities
			.map((activity, index) => ({
				...activity,
				lastValidDate: getLastValidDate(activity),
				uniqueKey: generateUniqueKey(activity, index),
			}))
			.sort((a, b) => {
				if (!a.lastValidDate && !b.lastValidDate) {
					return 0
				} else if (!a.lastValidDate) {
					return 1
				} else if (!b.lastValidDate) {
					return -1
				}

				return (
					new Date(b.lastValidDate).getTime() -
					new Date(a.lastValidDate).getTime()
				)
			})
	}, [activityData?.activities])

	const recentActivities = useMemo(() => {
		return sortedActivities.slice(0, 5)
	}, [sortedActivities])

	return (
		<div className="mt-16 max-w-6xl mx-auto">
			<div className="mb-8">
				<LinearH3 className="text-2xl font-semibold text-center">
					최근 활동 내역
				</LinearH3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<caption className="sr-only">
						최근 진행된 멘토링 활동 내역 테이블
					</caption>
					<thead>
						<tr className="border-b border-white/10">
							<th className="text-center py-4 px-4 text-white/70 font-medium">
								학교명
							</th>
							<th className="text-center py-4 px-4 text-white/70 font-medium">
								지역
							</th>
							<th className="text-center py-4 px-4 text-white/70 font-medium">
								최근 활동일
							</th>
							<th className="text-center py-4 px-4 text-white/70 font-medium">
								상태
							</th>
						</tr>
					</thead>
					<tbody>
						{recentActivities.length > 0 ? (
							recentActivities.map((activity) => (
								<tr
									key={activity.uniqueKey}
									className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
								>
									<td className="py-4 px-4 text-center">
										<LinearText className="font-medium">
											{activity.school
												? escapeHtml(activity.school)
												: '정보 없음'}
										</LinearText>
									</td>
									<td className="py-4 px-4 text-center">
										<LinearText className="text-white/80">
											{activity.location
												? escapeHtml(activity.location)
												: '정보 없음'}
										</LinearText>
									</td>
									<td className="py-4 px-4 text-center">
										<LinearText className="text-white/80">
											{getLastActivityDate(activity)}
										</LinearText>
									</td>
									<td className="py-4 px-4 text-center">
										<span
											className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
											aria-label={`활동 상태: ${activity.status ? escapeHtml(activity.status) : '알 수 없음'}`}
										>
											{activity.status
												? escapeHtml(activity.status)
												: '알 수 없음'}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className="py-8 px-4 text-center">
									<LinearText className="text-white/60">
										활동 내역이 없습니다.
									</LinearText>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex justify-end mt-4">
				<AllActivities activities={sortedActivities} />
			</div>
		</div>
	)
}
