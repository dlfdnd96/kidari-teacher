'use client'

import { LinearContainer, LinearH2, LinearText } from '@/components/ui'
import { ActivityStatistics } from './ActivityStatistics'
import { RecentActivity } from './RecentActivity'
import { SchoolLogo } from './SchoolLogo'
import { SECTION_IDS } from '@/constants/landing'
import { useActivityData } from '@/hooks/useActivityData'
import React from 'react'

export function AchievementsSection() {
	const { data: activityData, isLoading, isError } = useActivityData()

	return (
		<section id={SECTION_IDS.ACHIEVEMENTS} className="py-20 bg-[#0A0A0A]">
			<LinearContainer>
				<div className="text-center mb-16">
					<LinearH2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
						활동 내역
					</LinearH2>
					<LinearText className="text-lg text-white/90 leading-loose tracking-wide max-w-2xl mx-auto mt-4">
						2022년부터 현재까지 다양한 학교에서 진로 멘토링 활동을 하고 있습니다
					</LinearText>
				</div>

				{isLoading ? (
					<div className="text-center py-16">
						<LinearText className="text-white/60 text-lg">
							활동 데이터를 불러오는 중...
						</LinearText>
					</div>
				) : activityData && !isError ? (
					<>
						<ActivityStatistics activityData={activityData} />
						<RecentActivity activityData={activityData} />
						<SchoolLogo />
					</>
				) : (
					<div className="text-center py-16">
						<LinearText className="text-white/60 text-lg">
							활동 데이터를 불러올 수 없습니다.
						</LinearText>
					</div>
				)}
			</LinearContainer>
		</section>
	)
}
