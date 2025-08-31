'use client'

import { ActivityStatistics } from './ActivityStatistics'
import { RecentActivity } from './RecentActivity'
import { SchoolLogo } from './SchoolLogo'
import { SECTION_IDS } from '@/constants/landing'
import { useActivityData } from '@/components/features/landing/hooks/useActivityData'
import { Container } from '@/components/ui/container'

export function AchievementsSection() {
	const { data: activityData, isLoading, isError } = useActivityData()

	return (
		<section id={SECTION_IDS.ACHIEVEMENTS} className="py-20">
			<Container>
				<div className="text-center mb-16">
					<h2 className="text-5xl font-bold tracking-tight text-foreground leading-relaxed">
						활동 내역
					</h2>
					<p className="text-lg text-foreground/90 leading-loose tracking-wide max-w-2xl mx-auto mt-4">
						2022년부터 현재까지 다양한 학교에서 진로 멘토링 활동을 하고 있습니다
					</p>
				</div>

				{isLoading ? (
					<div className="text-center py-16">
						<p className="text-foreground/60 text-lg leading-normal">
							활동 데이터를 불러오는 중...
						</p>
					</div>
				) : activityData && !isError ? (
					<>
						<ActivityStatistics activityData={activityData} />
						<RecentActivity activityData={activityData} />
						<SchoolLogo />
					</>
				) : (
					<div className="text-center py-16">
						<p className="text-foreground/60 text-lg leading-normal">
							활동 데이터를 불러올 수 없습니다.
						</p>
					</div>
				)}
			</Container>
		</section>
	)
}
