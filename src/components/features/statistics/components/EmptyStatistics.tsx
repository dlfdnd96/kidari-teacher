import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function EmptyStatistics() {
	return (
		<div className="w-full space-y-6">
			<Card className="w-full border-0">
				<CardContent className="flex flex-col space-y-3 p-6">
					<Skeleton className="h-32 w-full rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
					</div>
				</CardContent>
			</Card>
			<Card className="w-full border-0">
				<CardContent className="flex flex-col space-y-3 p-6">
					<Skeleton className="h-32 w-full rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
					</div>
				</CardContent>
			</Card>
			<Card className="w-full border-0">
				<CardContent className="flex flex-col space-y-3 p-6">
					<Skeleton className="h-32 w-full rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
