import { Card, CardContent } from '@/components/ui/card'

export function EmptyStatistics() {
	return (
		<div className="space-y-6">
			{/* 중앙 메시지 */}
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-16 text-center">
					<h3 className="text-xl font-semibold mb-2">표시할 통계가 없습니다</h3>
				</CardContent>
			</Card>
		</div>
	)
}
