'use client'

import React, { memo, useCallback, useState } from 'react'
import {
	Calendar,
	MapPin,
	Clock,
	User,
	Phone,
	X,
	AlertTriangle,
	Briefcase,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { ERROR_MESSAGES, handleClientError } from '@/utils/error'
import { trpc } from '@/components/providers/TrpcProvider'
import type { MyApplicationCardProps } from '@/types/application'
import {
	APPLICATION_STATUS_LABELS,
	APPLICATION_STATUS_COLORS,
	APPLICATION_STATUS_DESCRIPTIONS,
} from '@/types/application'
import { TZDate } from '@date-fns/tz'
import { Enum } from '@/enums'
import { TIME_ZONE } from '@/constants/date'
import { formatPhoneNumber } from '@/utils/phone'
import { useSession } from 'next-auth/react'
import { PROFESSION_LABELS } from '@/constants/user-profile'

const MyApplicationCard = memo(({ application }: MyApplicationCardProps) => {
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()

	const utils = trpc.useUtils()

	const cancelApplicationMutation =
		trpc.application.deleteApplication.useMutation({
			onSuccess: async () => {
				await utils.application.getMyApplicationList.invalidate()
				await utils.volunteerActivity.getVolunteerActivityList.invalidate()
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 신청 취소 오류')
			},
			onSettled: () => {
				setShowCancelConfirm(false)
			},
		})

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			if (showCancelConfirm) {
				setShowCancelConfirm(false)
				e.stopPropagation()
				return
			}
		},
		[showCancelConfirm],
	)

	const handleCancel = useCallback(async () => {
		if (!session?.user) {
			handleClientError(
				ERROR_MESSAGES.AUTHENTICATION_ERROR,
				showError,
				'인증 오류',
			)
			return
		}

		try {
			await cancelApplicationMutation.mutateAsync({
				id: application.id,
			})
		} catch (error) {
			handleClientError(error, showError, '봉사활동 신청 취소 오류')
			setShowCancelConfirm(false)
		}
	}, [session?.user, showError, cancelApplicationMutation, application.id])

	if (!application.volunteerActivity) {
		return null
	}

	const statusColor =
		APPLICATION_STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'
	const statusLabel =
		APPLICATION_STATUS_LABELS[application.status] || application.status
	const statusDescription =
		APPLICATION_STATUS_DESCRIPTIONS[application.status] || ''

	const canCancel =
		application.status === Enum.ApplicationStatus.WAITING &&
		new TZDate(new Date(), TIME_ZONE.UTC) <
			new TZDate(application.volunteerActivity.startAt, TIME_ZONE.UTC)

	const isCanceling = cancelApplicationMutation.isPending

	return (
		<div
			className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mb-4 sm:mb-6 relative"
			onClick={handleCardClick}
		>
			{/* 헤더 */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center flex-1 min-w-0 mr-4">
					<h3
						className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
						title={application.volunteerActivity.title}
					>
						{application.volunteerActivity.title}
					</h3>
					<div
						className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
					>
						{statusLabel}
					</div>
				</div>

				{canCancel && (
					<div className="flex gap-2 shrink-0">
						{!showCancelConfirm ? (
							<button
								className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-full hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/30 dark:hover:to-pink-800/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={(e) => {
									e.stopPropagation()
									setShowCancelConfirm(true)
								}}
								type="button"
								aria-label="신청 취소"
								disabled={isCanceling}
							>
								<X className="w-4 h-4 mr-1.5" />
								<span>취소</span>
							</button>
						) : (
							<div className="flex gap-1">
								<button
									className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 rounded-full hover:from-gray-100 hover:to-gray-100 dark:hover:from-gray-800/30 dark:hover:to-gray-800/30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
									onClick={(e) => {
										e.stopPropagation()
										setShowCancelConfirm(false)
									}}
									disabled={isCanceling}
									type="button"
									aria-label="취소 철회"
								>
									취소
								</button>
								<button
									className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
									onClick={(e) => {
										e.stopPropagation()
										handleCancel()
									}}
									disabled={isCanceling}
									type="button"
									aria-label="취소 확인"
								>
									{isCanceling ? (
										<>
											<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
											<span>처리중...</span>
										</>
									) : (
										<>
											<AlertTriangle className="w-4 h-4 mr-1.5" />
											<span>확인</span>
										</>
									)}
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* 상태 설명 */}
			<div className="mb-4">
				<p className="text-gray-600 dark:text-gray-400 text-sm">
					{statusDescription}
				</p>
			</div>

			{/* 활동 정보 */}
			<div className="space-y-2 mb-4">
				{/* 일시 */}
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
					<span className="text-muted-foreground">일시:</span>
					<span className="font-medium">
						{format(
							new TZDate(
								application.volunteerActivity.startAt,
								TIME_ZONE.SEOUL,
							),
							'M/d (E) HH:mm',
							{ locale: ko },
						)}
						{application.volunteerActivity.startAt !==
							application.volunteerActivity.endAt && (
							<>
								{' '}
								~{' '}
								{format(
									new TZDate(
										application.volunteerActivity.endAt,
										TIME_ZONE.SEOUL,
									),
									'HH:mm',
									{ locale: ko },
								)}
							</>
						)}
					</span>
				</div>

				{/* 장소 */}
				<div className="flex items-center gap-2 text-sm">
					<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
					<span className="text-muted-foreground">장소:</span>
					<span className="font-medium line-clamp-1">
						{application.volunteerActivity.location}
					</span>
				</div>

				{/* 신청 직업 */}
				<div className="flex items-center gap-2 text-sm">
					<Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
					<span className="text-muted-foreground">신청 직업:</span>
					<span className="font-medium">
						{PROFESSION_LABELS[application.profession]}
					</span>
				</div>

				{/* 담당자 */}
				<div className="flex items-center gap-2 text-sm">
					<User className="h-4 w-4 text-muted-foreground shrink-0" />
					<span className="text-muted-foreground">담당자:</span>
					<span className="font-medium">
						{application.volunteerActivity.manager?.name || '관리자'}
					</span>
				</div>

				{/* 긴급연락처 */}
				<div className="flex items-center gap-2 text-sm">
					<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
					<span className="text-muted-foreground">긴급연락처:</span>
					<span className="font-medium">
						{formatPhoneNumber(application.emergencyContact)}
					</span>
				</div>
			</div>

			{/* 푸터 */}
			<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
				<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
					<Clock className="w-4 h-4 mr-1.5" />
					<span>
						신청일:{' '}
						{format(new TZDate(application.createdAt, TIME_ZONE.SEOUL), 'M/d', {
							locale: ko,
						})}
					</span>
				</div>
			</div>

			{/* 액센트 라인 */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	)
})

MyApplicationCard.displayName = 'MyApplicationCard'

export default MyApplicationCard
