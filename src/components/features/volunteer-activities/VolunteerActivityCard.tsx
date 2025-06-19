'use client'

import React, { memo, useCallback, useState } from 'react'
import {
	Calendar,
	MapPin,
	Users,
	Clock,
	User,
	PenLine,
	Trash,
	X,
} from 'lucide-react'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Enum } from '@/enums'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { ERROR_MESSAGES, handleClientError } from '@/utils/error'
import { trpc } from '@/components/providers/TrpcProvider'
import VolunteerActivityEditForm from '@/components/features/volunteer-activities/VolunteerActivityEditForm'
import type { VolunteerActivityCardProps } from '@/types/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
} from '@/types/volunteer-activity'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'

const VolunteerActivityCard = memo(
	({ activity, onViewDetail, onApply }: VolunteerActivityCardProps) => {
		const { data: session } = useSession()
		const isAdmin = session?.user.role === Enum.Role.ADMIN
		const [editing, setEditing] = useState(false)
		const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()

		const deleteVolunteerActivityMutation =
			trpc.volunteerActivity.deleteVolunteerActivity.useMutation({
				onSuccess: async () => {
					await utils.volunteerActivity.getVolunteerActivityList.invalidate()
					router.refresh()
				},
				onError: (error) => {
					handleClientError(error, showError, '봉사활동 삭제 오류')
				},
				onSettled: () => {
					setShowDeleteConfirm(false)
				},
			})

		const isManager =
			session?.user.id === activity.managerId ||
			session?.user.role === Enum.Role.ADMIN
		const canApply =
			activity.status === Enum.VolunteerActivityStatus.RECRUITING &&
			startOfDay(new TZDate(new Date(), TIME_ZONE.UTC)) <=
				startOfDay(activity.applicationDeadline)

		const hasApplied = session?.user.id
			? activity.applications?.some((app) => app.user?.id === session?.user.id)
			: false

		const applicationCount = activity.applications?.length || 0
		const maxParticipants = activity.maxParticipants || 0
		const isFullyBooked =
			maxParticipants > 0 && applicationCount >= maxParticipants

		const statusColor =
			VOLUNTEER_ACTIVITY_STATUS_COLORS[activity.status] ||
			'bg-gray-100 text-gray-800'
		const statusLabel =
			VOLUNTEER_ACTIVITY_STATUS_LABELS[activity.status] || activity.status

		const handleViewDetail = useCallback(() => {
			onViewDetail?.(activity)
		}, [activity, onViewDetail])

		const handleCardClick = useCallback(
			(e: React.MouseEvent) => {
				if (showDeleteConfirm) {
					setShowDeleteConfirm(false)
					e.stopPropagation()
					return
				}
				handleViewDetail()
			},
			[showDeleteConfirm, handleViewDetail],
		)

		const handleEdit = useCallback(() => {
			setEditing(true)
		}, [])

		const handleCancelEdit = useCallback(() => {
			setEditing(false)
		}, [])

		const handleDelete = useCallback(async () => {
			if (!session?.user) {
				handleClientError(
					ERROR_MESSAGES.AUTHENTICATION_ERROR,
					showError,
					'인증 오류',
				)
				return
			}

			try {
				await deleteVolunteerActivityMutation.mutateAsync({
					id: activity.id,
				})
			} catch (error) {
				handleClientError(error, showError, '봉사활동 삭제 오류')
				setShowDeleteConfirm(false)
			}
		}, [session?.user, showError, deleteVolunteerActivityMutation, activity.id])

		const isDeleting = deleteVolunteerActivityMutation.isPending

		if (editing) {
			return (
				<VolunteerActivityEditForm
					id={activity.id}
					initialTitle={activity.title}
					initialDescription={activity.description}
					initialStartAt={new TZDate(activity.startAt, TIME_ZONE.SEOUL)}
					initialEndAt={new TZDate(activity.endAt, TIME_ZONE.SEOUL)}
					initialLocation={activity.location}
					initialStatus={activity.status}
					initialApplicationDeadline={activity.applicationDeadline}
					initialMaxParticipants={activity.maxParticipants ?? undefined}
					onCancel={handleCancelEdit}
				/>
			)
		}

		return (
			<>
				<div
					className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mb-4 sm:mb-6 cursor-pointer relative"
					onClick={handleCardClick}
				>
					{/* 헤더 */}
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-center flex-1 min-w-0 mr-4">
							<h3
								className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200"
								title={activity.title}
							>
								{activity.title}
							</h3>
							<div
								className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
							>
								{statusLabel}
							</div>
						</div>

						{isAdmin && (
							<div className="flex gap-2 shrink-0">
								<button
									className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									onClick={(e) => {
										e.stopPropagation()
										handleEdit()
									}}
									type="button"
									aria-label="봉사활동 수정"
									disabled={isDeleting}
								>
									<PenLine className="w-4 h-4 mr-1.5" />
									<span>수정</span>
								</button>

								{!showDeleteConfirm ? (
									<button
										className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-full hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/30 dark:hover:to-pink-800/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										onClick={(e) => {
											e.stopPropagation()
											setShowDeleteConfirm(true)
										}}
										type="button"
										aria-label="봉사활동 삭제"
										disabled={isDeleting || applicationCount > 0}
									>
										<Trash className="w-4 h-4 mr-1.5" />
										<span>삭제</span>
									</button>
								) : (
									<div className="flex gap-1">
										<button
											className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={(e) => {
												e.stopPropagation()
												setShowDeleteConfirm(false)
											}}
											disabled={isDeleting}
											type="button"
											aria-label="삭제 취소"
										>
											<X className="w-4 h-4 mr-1.5" />
											<span>취소</span>
										</button>
										<button
											className="flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
											onClick={(e) => {
												e.stopPropagation()
												handleDelete()
											}}
											disabled={isDeleting}
											type="button"
											aria-label="삭제 확인"
										>
											{isDeleting ? (
												<>
													<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
													<span>삭제중...</span>
												</>
											) : (
												<>
													<Trash className="w-4 h-4 mr-1.5" />
													<span>확인</span>
												</>
											)}
										</button>
									</div>
								)}
							</div>
						)}
					</div>

					{/* 내용 */}
					<div className="mb-4">
						<p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
							{activity.description}
						</p>
						{activity.description.length > 100 && (
							<div className="mt-2">
								<span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
									클릭하여 전체 내용 보기 →
								</span>
							</div>
						)}
					</div>

					{/* 활동 정보 */}
					<div className="space-y-2 mb-4">
						{/* 일시 */}
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="text-muted-foreground">일시:</span>
							<span className="font-medium">
								{format(
									new TZDate(activity.startAt, TIME_ZONE.SEOUL),
									'M/d (E) HH:mm',
									{
										locale: ko,
									},
								)}
								{activity.startAt !== activity.endAt && (
									<>
										{' '}
										~{' '}
										{format(
											new TZDate(activity.endAt, TIME_ZONE.SEOUL),
											'HH:mm',
											{
												locale: ko,
											},
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
								{activity.location}
							</span>
						</div>

						{/* 신청 현황 */}
						<div className="flex items-center gap-2 text-sm">
							<Users className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="text-muted-foreground">신청:</span>
							<span className="font-medium">
								{applicationCount}명
								{maxParticipants > 0 && ` / ${maxParticipants}명`}
							</span>
							{isFullyBooked && (
								<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
									마감
								</span>
							)}
						</div>

						{/* 신청 마감일 */}
						<div className="flex items-center gap-2 text-sm">
							<Clock className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="text-muted-foreground">마감:</span>
							<span className="font-medium">
								{format(activity.applicationDeadline, 'M/d (E)')}
							</span>
							{startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) >
								startOfDay(activity.applicationDeadline) && (
								<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
									마감됨
								</span>
							)}
						</div>

						{/* 담당자 */}
						<div className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="text-muted-foreground">담당자:</span>
							<span className="font-medium">
								{activity.manager?.name ?? '관리자'}
							</span>
						</div>
					</div>

					{/* 푸터 */}
					<div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
						<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
							<PenLine className="w-4 h-4 mr-1.5" />
							<span className="font-medium">
								{activity.manager?.name ?? '관리자'}
							</span>
						</div>

						<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
							<Calendar className="w-4 h-4 mr-1.5" />
							<time dateTime={activity.createdAt.toLocaleDateString('ko-KR')}>
								{activity.createdAt.toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
						</div>
					</div>

					{/* 액션 버튼들 */}
					<div className="mt-4 flex flex-wrap gap-2">
						<button
							className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
							onClick={(e) => {
								e.stopPropagation()
								handleViewDetail()
							}}
						>
							자세히 보기
						</button>

						{/* 신청 버튼 (로그인된 일반 사용자, 신청 가능한 상태) */}
						{session?.user.id && !isManager && canApply && !isFullyBooked && (
							<button
								className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={(e) => {
									e.stopPropagation()
									onApply?.(activity)
								}}
								disabled={hasApplied}
							>
								{hasApplied ? '신청 완료' : '신청하기'}
							</button>
						)}
					</div>

					{/* 액센트 라인 */}
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			</>
		)
	},
)

VolunteerActivityCard.displayName = 'VolunteerActivityCard'

export default VolunteerActivityCard
