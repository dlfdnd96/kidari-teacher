'use client'

import React, { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import { Enum } from '@/enums'
import VolunteerActivityEditPage from './VolunteerActivityEditPage'
import { VolunteerActivityEditPageClientProps } from '@/types/volunteer-activity'

const VolunteerActivityEditPageClient: FC<
	VolunteerActivityEditPageClientProps
> = ({ id }) => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()

	const { data: activity, isLoading: isActivityLoading } =
		trpc.volunteerActivity.getVolunteerActivity.useQuery(
			{ id },
			{
				retry: false,
				staleTime: 5 * 60 * 1000,
			},
		)

	const handleCancel = () => {
		if (typeof window !== 'undefined') {
			const detailId = sessionStorage.getItem('volunteer-activity-detail-id')
			if (detailId === id) {
				sessionStorage.removeItem('volunteer-activity-detail-id')
				router.push(`/volunteer-activities/${id}`)
				return
			}
		}
		router.push('/volunteer-activities')
	}

	if (isActivityLoading) {
		return (
			<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
				</div>
			</div>
		)
	}

	if (!activity) {
		handleClientError(
			CLIENT_ERROR_KEY_MAPPING.NOT_FOUND_ERROR,
			showError,
			'봉사활동 불러오기 오류',
		)
		router.push(`/volunteer-activities/${id}`)
		return
	}

	const canEdit =
		session?.user.id === activity.managerId ||
		session?.user.role === Enum.Role.ADMIN

	if (!canEdit) {
		handleClientError(
			CLIENT_ERROR_KEY_MAPPING.AUTHORIZATION_ERROR,
			showError,
			'권한 오류',
		)
		router.push(`/volunteer-activities/${id}`)
		return
	}

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* 상단 네비게이션 */}
			<div>
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
					<div className="flex items-center h-14">
						<div className="py-4">
							<button
								onClick={handleCancel}
								className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
							>
								<ArrowLeft className="w-5 h-5 cursor-pointer" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* 메인 컨텐츠 */}
			<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
				<div className="bg-white dark:bg-gray-800 p-6 sm:p-8">
					{/* 헤더 */}
					<div className="mb-8">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
									봉사활동 수정
								</h1>
							</div>
						</div>
						<div className="border-b border-gray-200 dark:border-gray-700"></div>
					</div>

					{/* 수정 폼 */}
					<div>
						<VolunteerActivityEditPage
							id={activity.id}
							initialTitle={activity.title}
							initialDescription={activity.description}
							initialStartAt={activity.startAt}
							initialEndAt={activity.endAt}
							initialLocation={activity.location}
							initialStatus={activity.status}
							initialApplicationDeadline={activity.applicationDeadline}
							initialMaxParticipants={activity.maxParticipants}
							onCancel={handleCancel}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VolunteerActivityEditPageClient
