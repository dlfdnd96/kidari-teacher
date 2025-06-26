import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VolunteerActivityEditPageClient from '@/components/features/volunteer-activities/VolunteerActivityEditPageClient'
import { VolunteerActivityEditPageProps } from '@/types/volunteer-activity'

export async function generateMetadata({
	params,
}: VolunteerActivityEditPageProps): Promise<Metadata> {
	const { id } = await params

	return {
		title: `봉사활동 수정 | 키다리 선생님`,
		description: '봉사활동 정보를 수정합니다.',
		keywords: ['봉사활동', '수정', '편집', '키다리선생님', '교육봉사'],
		robots: 'noindex, nofollow', // 수정 페이지는 검색엔진에 노출하지 않음
		alternates: {
			canonical: `/volunteer-activities/${id}/edit`,
		},
		openGraph: {
			title: '봉사활동 수정 | 키다리 선생님',
			description: '봉사활동 정보를 수정합니다.',
			type: 'website',
			siteName: '키다리 선생님',
		},
		twitter: {
			card: 'summary_large_image',
			title: '봉사활동 수정 | 키다리 선생님',
			description: '봉사활동 정보를 수정합니다.',
		},
	}
}

export default async function VolunteerActivityEditPage({
	params,
}: VolunteerActivityEditPageProps) {
	const { id } = await params

	if (!id) {
		notFound()
	}

	return <VolunteerActivityEditPageClient id={id} />
}
