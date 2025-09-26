import { Crown, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RankingListSchema } from '@/schemas/statistics'
import type { ZodType } from '@/types'
import { maskString } from '@/utils/string'

interface RankingListProps {
	rankings: ZodType<typeof RankingListSchema>
	title?: string
	showTopThree?: boolean
	maxItems?: number
}

const getRankIcon = (rank: number) => {
	switch (rank) {
		case 1:
			return <Crown className="size-4 text-primary" />
		default:
			return null
	}
}

const getRankCardClassName = (rank: number) => {
	switch (rank) {
		case 1:
			return 'border-destructive bg-destructive/10'
		default:
			return ''
	}
}

export function RankingList({
	rankings,
	title = '랭킹',
	maxItems,
}: RankingListProps) {
	const displayRankings = maxItems ? rankings.slice(0, maxItems) : rankings

	if (rankings.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
						<User className="size-8 mb-2" />
						<p>랭킹 데이터가 없습니다</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="rounded-xl border border-primary/20 bg-card text-card-foreground shadow @container/card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{displayRankings.map((item) => {
						const rank = item.rank
						const rankIcon = getRankIcon(rank)
						const cardClassName = getRankCardClassName(rank)

						return (
							<div
								key={item.id}
								className={`flex items-center justify-between p-4 rounded-lg border border-primary/20 ${cardClassName}`}
							>
								<div className="flex items-center gap-3">
									<Badge
										variant="outline"
										className="min-w-8 h-8 flex items-center justify-center"
									>
										{rankIcon || rank}
									</Badge>
									<div className="flex flex-col">
										<div className="font-medium">{maskString(item.name)}</div>
										{item.location && (
											<div className="text-sm text-muted-foreground">
												{item.location}
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-col items-end">
									<div className="font-semibold text-lg">{item.score}회</div>
									{item.category && (
										<Badge variant="secondary" className="text-xs">
											{item.category}
										</Badge>
									)}
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
