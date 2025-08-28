'use client'

import { trpc } from '@/components/providers/TrpcProvider'
import { BentoGrid, type BentoItem } from '@/components/ui/card'
import { GraduationCap, Heart } from 'lucide-react'

export default function HistoryPage() {
	const { data, isLoading, error } = trpc.history.fetchData.useQuery()

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-white text-lg">데이터를 불러오는 중...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-red-400 text-lg">
					데이터를 불러오는데 실패했습니다: {error.message}
				</div>
			</div>
		)
	}

	if (!data || data.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-slate-400 text-lg">활동 기록이 없습니다.</div>
			</div>
		)
	}

	const historyItems: BentoItem[] = data.map((activity, index) => ({
		id: `activity-${index}`,
		title: activity.serviceName,
		description: `${activity.location}에서 진행된 ${activity.category} 활동`,
		icon:
			activity.category === '진로' ? (
				<GraduationCap size={16} />
			) : (
				<Heart size={16} />
			),
		status: activity.status,
		meta: `${activity.year}년 ${activity.month}월`,
		tags: [`${activity.participants.length}명 참여`],
		cta: new Date(activity.date).toLocaleDateString('ko-KR'),
	}))

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			<div className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-4">봉사활동 기록</h1>
					<p className="text-slate-300 text-lg">
						지금까지 진행된 모든 봉사활동을 확인하세요
					</p>
					<div className="mt-6 flex justify-center space-x-8 text-slate-300">
						<div className="text-center">
							<div className="text-2xl font-bold text-white">{data.length}</div>
							<div className="text-sm">총 활동 수</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{new Set(data.map((a) => a.year)).size}
							</div>
							<div className="text-sm">활동 연도</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{data.reduce((sum, a) => sum + a.participants.length, 0)}
							</div>
							<div className="text-sm">총 참여자 수</div>
						</div>
					</div>
				</div>
				<BentoGrid items={historyItems} />
			</div>
		</div>
	)
}
