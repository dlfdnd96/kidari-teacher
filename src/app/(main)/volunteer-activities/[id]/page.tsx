import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VolunteerActivityDetailPage from '@/components/features/volunteer-activities/VolunteerActivityDetailPage'
import { VolunteerActivityDetailPageProps } from '@/types/volunteer-activity'

export async function generateMetadata({
	params,
}: VolunteerActivityDetailPageProps): Promise<Metadata> {
	const { id } = await params

	return {
		title: `봉사활동 상세 | 키다리 선생님`,
		description: '봉사활동 상세 정보를 확인하고 신청해보세요.',
		keywords: ['봉사활동', '자원봉사', '사회봉사', '키다리선생님', '교육봉사'],
		alternates: {
			canonical: `/volunteer-activities/${id}`,
		},
		openGraph: {
			title: '봉사활동 상세 | 키다리 선생님',
			description: '봉사활동 상세 정보를 확인하고 신청해보세요.',
			type: 'website',
			siteName: '키다리 선생님',
		},
		twitter: {
			card: 'summary_large_image',
			title: '봉사활동 상세 | 키다리 선생님',
			description: '봉사활동 상세 정보를 확인하고 신청해보세요.',
		},
	}
}

export default async function VolunteerActivityDetailPageRoute({
	params,
}: VolunteerActivityDetailPageProps) {
	const { id } = await params

	if (!id) {
		notFound()
	}

	return <VolunteerActivityDetailPage id={id} />
}
