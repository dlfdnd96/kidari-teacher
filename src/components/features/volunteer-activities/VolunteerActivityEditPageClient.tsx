'use client'

import React, { memo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { VolunteerActivityEditPageClientProps } from '@/types/volunteer-activity'
import { BackButton, ErrorState, LoadingSpinner } from '@/components/common/ui'
import { useVolunteerActivityActions } from './hooks'
import { Enum } from '@/enums'
import { VolunteerActivityForm } from './components'
import { ZodType } from '@/shared/types'
import { VolunteerActivityFormSchema } from '@/shared/schemas/volunteer-activity'

const VolunteerActivityEditPageClient = memo(
	({ id }: VolunteerActivityEditPageClientProps) => {
		const { data: session } = useSession()
		const {
			getVolunteerActivityQuery,
			checkAuthentication,
			updateVolunteerActivityMutation,
			navigateToList,
			navigateToDetail,
		} = useVolunteerActivityActions()

		const {
			data: activity,
			isLoading,
			isError,
		} = getVolunteerActivityQuery({ id })

		const handleSubmit = useCallback(
			async (data: ZodType<typeof VolunteerActivityFormSchema>) => {
				if (!checkAuthentication()) {
					return
				}

				await updateVolunteerActivityMutation.mutateAsync({
					id,
					...data,
				})
			},
			[checkAuthentication, updateVolunteerActivityMutation, id],
		)

		const handleCancel = useCallback(() => {
			navigateToDetail(id)
		}, [navigateToDetail, id])

		if (isLoading) {
			return (
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner size="lg" />
				</div>
			)
		}

		if (isError || !activity) {
			return (
				<div className="min-h-screen">
					{/* 상단 네비게이션 */}
					<div>
						<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
							<div className="flex items-center justify-between h-14">
								<div className="py-4">
									<BackButton onClick={navigateToList} />
								</div>
							</div>
						</div>
					</div>

					{/* 메인 컨텐츠 */}
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
						<div className="p-6 sm:p-8">
							<ErrorState
								title="봉사활동을 찾을 수 없습니다"
								message="요청하신 봉사활동이 존재하지 않거나 삭제되었습니다."
								onRetry={navigateToList}
							/>
						</div>
					</div>
				</div>
			)
		}

		const canEdit =
			session?.user.id === activity.managerId ||
			session?.user.role === Enum.Role.ADMIN

		if (!canEdit) {
			return (
				<div className="min-h-screen">
					{/* 상단 네비게이션 */}
					<div>
						<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
							<div className="flex items-center justify-between h-14">
								<div className="py-4">
									<BackButton onClick={navigateToDetail.bind(null, id)} />
								</div>
							</div>
						</div>
					</div>

					{/* 메인 컨텐츠 */}
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
						<div className="p-6 sm:p-8">
							<ErrorState
								title="수정 권한이 없습니다"
								message="이 봉사활동을 수정할 권한이 없습니다."
								onRetry={() => navigateToDetail(id)}
							/>
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className="min-h-screen">
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
					<VolunteerActivityForm
						activity={activity}
						onSubmit={handleSubmit}
						onSuccess={handleCancel}
						onCancel={handleCancel}
					/>
				</div>
			</div>
		)
	},
)

VolunteerActivityEditPageClient.displayName = 'VolunteerActivityEditPageClient'

export default VolunteerActivityEditPageClient
