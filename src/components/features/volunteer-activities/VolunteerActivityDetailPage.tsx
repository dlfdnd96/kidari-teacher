'use client'

import React, { FC, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Calendar,
	Clock,
	Edit,
	Eye,
	FileText,
	Mail,
	MapPin,
	Phone,
	Trash2,
	User,
	Users,
} from 'lucide-react'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityDetailProps,
} from '@/types/volunteer-activity'
import {
	APPLICATION_STATUS_COLORS,
	APPLICATION_STATUS_LABELS,
} from '@/types/application'
import { Enum, ZodEnum } from '@/enums'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { trpc } from '@/components/providers/TrpcProvider'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import { formatPhoneNumber } from '@/utils/phone'
import { useSession } from 'next-auth/react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import dynamic from 'next/dynamic'

const ApplicationModal = dynamic(
	() => import('@/components/features/applications/ApplicationModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

const VolunteerActivityDetailPage: FC<VolunteerActivityDetailProps> = ({
	id,
}) => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()
	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const utils = trpc.useUtils()

	const { data: activity, isLoading: isActivityLoading } =
		trpc.volunteerActivity.getVolunteerActivity.useQuery(
			{ id },
			{
				retry: false,
				staleTime: 5 * 60 * 1000,
			},
		)

	const { data: applicationListResult, refetch: refetchApplications } =
		trpc.application.getApplicationList.useQuery(
			{
				filter: { volunteerActivityId: id },
			},
			{
				enabled: !!activity,
			},
		)

	const { data: userProfileWithProfessions } =
		trpc.userProfile.getUserProfileWithProfessions.useQuery(undefined, {
			retry: false,
			staleTime: 5 * 60 * 1000,
			enabled: !!session?.user.id,
		})

	const updateApplicationStatusMutation =
		trpc.application.updateApplicationStatus.useMutation({
			onSuccess: async () => {
				await Promise.all([
					refetchApplications(),
					utils.application.getMyApplicationList.invalidate(),
				])
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 상태 수정 오류')
			},
		})

	const deleteVolunteerActivityMutation =
		trpc.volunteerActivity.deleteVolunteerActivity.useMutation({
			onSuccess: async () => {
				await utils.volunteerActivity.getVolunteerActivityList.invalidate()
				router.push('/volunteer-activities')
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 삭제 오류')
			},
		})

	const handleStatusChange = useCallback(
		async (applicationId: string, newStatus: string) => {
			if (!session?.user) {
				handleClientError(
					CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
					showError,
					'인증 오류',
				)
				return
			}

			try {
				const parsedNewStatus = ZodEnum.ApplicationStatus.parse(newStatus)

				await updateApplicationStatusMutation.mutateAsync({
					ids: [applicationId],
					status: parsedNewStatus,
				})
			} catch (error) {
				handleClientError(error, showError, '봉사활동 상태 수정 오류')
			}
		},
		[session?.user, showError, updateApplicationStatusMutation],
	)

	const handleBulkStatusChange = useCallback(
		async (targetStatus: string, newStatus: string) => {
			if (!session?.user) {
				handleClientError(
					CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
					showError,
					'인증 오류',
				)
				return
			}

			try {
				const parsedNewStatus = ZodEnum.ApplicationStatus.parse(newStatus)
				const parsedTargetStatus = ZodEnum.ApplicationStatus.parse(targetStatus)

				const applicationsToUpdate =
					applicationListResult?.applicationList.filter(
						(app) => app.status === parsedTargetStatus,
					) || []

				if (applicationsToUpdate.length === 0) {
					return
				}

				await updateApplicationStatusMutation.mutateAsync({
					ids: applicationsToUpdate.map(({ id }) => id),
					status: parsedNewStatus,
				})
			} catch (error) {
				handleClientError(error, showError, '봉사활동 상태 수정 오류')
			}
		},
		[
			session?.user,
			showError,
			applicationListResult?.applicationList,
			updateApplicationStatusMutation,
		],
	)

	const handleApply = useCallback(() => {
		if (!session?.user) {
			handleClientError(
				CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
				showError,
				'인증 오류',
			)
			return
		}

		if (!activity) {
			return
		}

		setIsApplicationModalOpen(true)
	}, [session?.user, activity, showError])

	const handleCloseApplicationModal = useCallback(() => {
		setIsApplicationModalOpen(false)
	}, [])

	const handleApplicationSuccess = useCallback(async () => {
		await Promise.all([
			utils.volunteerActivity.getVolunteerActivityList.invalidate(),
			utils.application.getApplicationList.invalidate(),
		])
	}, [utils])

	const handleDeleteClick = useCallback(() => {
		setIsDeleteDialogOpen(true)
	}, [])

	const handleDeleteConfirm = useCallback(async () => {
		if (!activity) return

		try {
			await deleteVolunteerActivityMutation.mutateAsync({ id: activity.id })
		} catch (error) {
			handleClientError(error, showError, '봉사활동 삭제 오류')
		} finally {
			setIsDeleteDialogOpen(false)
		}
	}, [activity, deleteVolunteerActivityMutation, showError])

	const handleDeleteCancel = useCallback(() => {
		setIsDeleteDialogOpen(false)
	}, [])

	const handleEditClick = useCallback(() => {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('volunteer-activity-detail-id', id)
		}
		router.push(`/volunteer-activities/${id}/edit`)
	}, [router, id])

	const handleGoBack = useCallback(() => {
		if (typeof window !== 'undefined') {
			try {
				const savedFilters = sessionStorage.getItem(
					'volunteer-activities-filters',
				)
				if (savedFilters) {
					const filters = JSON.parse(savedFilters)
					const urlParams = new URLSearchParams()

					if (filters.status) {
						urlParams.set('status', filters.status)
					}
					if (filters.search) {
						urlParams.set('search', filters.search)
					}
					if (filters.page) {
						urlParams.set('page', filters.page.toString())
					}

					const queryString = urlParams.toString()
					const targetUrl = queryString
						? `/volunteer-activities?${queryString}`
						: '/volunteer-activities'

					sessionStorage.removeItem('volunteer-activities-filters')

					router.push(targetUrl)
					return
				}
			} catch (error) {
				console.warn('필터 상태 복원 중 오류:', error)
			}
		}

		router.push('/volunteer-activities')
	}, [router])

	useEffect(() => {
		if (!isActivityLoading && !activity) {
			handleClientError(
				CLIENT_ERROR_KEY_MAPPING.NOT_FOUND_ERROR,
				showError,
				'봉사활동 불러오기 오류',
			)
			router.push('/volunteer-activities')
		}
	}, [activity, isActivityLoading, router, showError])

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
		return null
	}

	const isManager = session?.user.role === Enum.Role.ADMIN
	const isWriter = session?.user.id === activity.managerId
	const canApply =
		activity.status === Enum.VolunteerActivityStatus.RECRUITING &&
		startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) <=
			startOfDay(activity.applicationDeadline)
	const hasApplied = applicationListResult?.applicationList.some(
		(app) => app.user?.id === session?.user.id,
	)
	const isDeadlinePassed =
		startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) >
		startOfDay(activity.applicationDeadline)

	const applicationCount = applicationListResult?.applicationList.length || 0
	const maxParticipants = activity.maxParticipants || 0

	const isFullyBooked =
		maxParticipants > 0 && applicationCount >= maxParticipants

	const statusColor =
		VOLUNTEER_ACTIVITY_STATUS_COLORS[activity.status] ||
		'bg-gray-100 text-gray-800'
	const statusLabel =
		VOLUNTEER_ACTIVITY_STATUS_LABELS[activity.status] || activity.status

	const userProfessions = userProfileWithProfessions?.professions || []
	const hasNoProfessions = userProfessions.length === 0

	const usedProfessions =
		applicationListResult?.applicationList.map((app) => app.profession) || []

	const availableProfessions = userProfessions.filter(
		(profession) => !usedProfessions.includes(profession),
	)

	const cannotApplyDueToProfession =
		hasNoProfessions || availableProfessions.length === 0

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* 상단 네비게이션 */}
			<div>
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
					<div className="flex items-center justify-between h-14">
						<div className="py-4">
							<button
								onClick={handleGoBack}
								className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
							>
								<ArrowLeft className="w-5 h-5 cursor-pointer" />
							</button>
						</div>

						{/* 수정/삭제 버튼 */}
						{(isManager || isWriter) && (
							<div className="py-4 flex items-center gap-2">
								<button
									onClick={handleEditClick}
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer"
								>
									<Edit className="w-4 h-4" />
									<span>수정</span>
								</button>
								<button
									onClick={handleDeleteClick}
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer"
								>
									<Trash2 className="w-4 h-4" />
									<span>삭제</span>
								</button>
							</div>
						)}
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
								<div className="flex items-center gap-3 mb-3">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
										{activity.title}
									</h1>
									<div
										className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
									>
										{statusLabel}
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
									<div className="flex items-center">
										<User className="w-4 h-4 mr-2" />
										<span className="text-sm font-medium">
											{activity.manager?.name ?? '관리자'}
										</span>
									</div>
									<div className="flex items-center">
										<Calendar className="w-4 h-4 mr-2" />
										<time className="text-sm">
											{activity.createdAt.toLocaleDateString('ko-KR', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												weekday: 'short',
											})}
										</time>
									</div>
								</div>
							</div>
						</div>
						<div className="border-b border-gray-200 dark:border-gray-700"></div>
					</div>

					{/* 내용 */}
					<div className="space-y-8">
						<div className="space-y-6">
							{/* 기본 정보 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* 일시 */}
								<div className="flex items-start gap-3">
									<Calendar className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div>
										<div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
											활동 일시
										</div>
										<div className="text-gray-700 dark:text-gray-300">
											{format(
												new TZDate(activity.startAt, TIME_ZONE.SEOUL),
												'yyyy년 M월 d일 (E) HH:mm',
												{ locale: ko },
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
										</div>
									</div>
								</div>

								{/* 장소 */}
								<div className="flex items-start gap-3">
									<MapPin className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div>
										<div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
											활동 장소
										</div>
										<div className="text-gray-700 dark:text-gray-300">
											{activity.location}
										</div>
									</div>
								</div>

								{/* 신청 현황 */}
								<div className="flex items-start gap-3">
									<Users className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
											신청 현황
										</div>
										<div className="flex items-center gap-2">
											<span className="text-gray-700 dark:text-gray-300 font-medium">
												{applicationCount}명
												{maxParticipants > 0 && ` / ${maxParticipants}명`}
											</span>
											{isFullyBooked && (
												<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
													마감
												</span>
											)}
										</div>
									</div>
								</div>

								{/* 신청 마감일 */}
								<div className="flex items-start gap-3">
									<Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div>
										<div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
											신청 마감일
										</div>
										<div className="flex items-center gap-2">
											<span className="text-gray-700 dark:text-gray-300">
												{format(
													new TZDate(
														activity.applicationDeadline,
														TIME_ZONE.SEOUL,
													),
													'yyyy년 M월 d일 (E)',
													{ locale: ko },
												)}
											</span>
											{isDeadlinePassed && (
												<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
													마감됨
												</span>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* 구분선 */}
							<div className="border-t border-gray-200 dark:border-gray-700"></div>

							{/* 활동 설명 */}
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<FileText className="h-5 w-5 text-emerald-600" />
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										활동 설명
									</h3>
								</div>
								<div className="prose prose-gray dark:prose-invert max-w-none">
									<div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-base">
										{activity.description}
									</div>
								</div>
							</div>

							{/* 신청 안내 */}
							{session?.user.id && (
								<>
									<div className="border-t border-gray-200 dark:border-gray-700"></div>
									<div className="space-y-3">
										{hasApplied ? (
											<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
												<div className="flex items-center">
													<AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
													<span className="text-green-800 dark:text-green-200 font-medium">
														이미 이 봉사활동에 신청하셨습니다.
													</span>
												</div>
											</div>
										) : !canApply ? (
											<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
												<div className="flex items-center">
													<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
													<span className="text-red-800 dark:text-red-200 font-medium">
														{isDeadlinePassed
															? '신청 마감일이 지났습니다.'
															: isFullyBooked
																? '모집 정원이 마감되었습니다.'
																: '현재 신청을 받지 않는 상태입니다.'}
													</span>
												</div>
											</div>
										) : (
											<div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
												<div className="flex items-center">
													<AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3" />
													<span className="text-emerald-800 dark:text-emerald-200 font-medium">
														신청 버튼을 클릭하여 이 봉사활동에 참여 신청하세요.
													</span>
												</div>
											</div>
										)}
									</div>
								</>
							)}

							{/* 신청자 섹션 */}
							{applicationListResult?.applicationList &&
								applicationListResult?.applicationList.length > 0 && (
									<>
										<div className="border-t border-gray-200 dark:border-gray-700"></div>
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<Users className="h-5 w-5 text-blue-600" />
												<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
													신청자 (
													{applicationListResult?.applicationList.length}
													명)
												</h3>
											</div>

											<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
												<div className="space-y-4">
													{applicationListResult?.applicationList.map(
														(application) => {
															const statusColor =
																APPLICATION_STATUS_COLORS[application.status] ||
																'bg-gray-100 text-gray-800'
															const statusLabel =
																APPLICATION_STATUS_LABELS[application.status] ||
																application.status

															return (
																<div
																	key={application.id}
																	className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
																>
																	<div className="flex items-center justify-between">
																		<div className="flex-1 min-w-0">
																			<div className="flex items-center gap-3 mb-3">
																				<div className="flex items-center gap-2">
																					<User className="w-4 h-4 text-gray-500" />
																					<span className="font-medium text-gray-900 dark:text-gray-100">
																						{application.user?.name || '사용자'}
																					</span>
																				</div>
																				<div
																					className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
																				>
																					{statusLabel}
																				</div>
																			</div>

																			<div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
																				<div className="flex items-center gap-1">
																					<Mail className="w-3 h-3" />
																					<span>
																						{application.user?.email ||
																							'이메일 없음'}
																					</span>
																				</div>
																				<div className="flex items-center gap-1">
																					<Phone className="w-3 h-3" />
																					<span>
																						{formatPhoneNumber(
																							application.emergencyContact,
																						)}
																					</span>
																				</div>
																				<div className="flex items-center gap-1">
																					<Clock className="w-3 h-3" />
																					<span>
																						{format(
																							new TZDate(
																								application.createdAt,
																								TIME_ZONE.SEOUL,
																							),
																							'M월 d일',
																							{ locale: ko },
																						)}
																					</span>
																				</div>
																			</div>
																		</div>

																		{isManager && (
																			<div className="flex items-center gap-2 ml-4">
																				{/* 신청 상세 보기 버튼 */}
																				<button
																					type="button"
																					className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
																					title="상세 보기"
																				>
																					<Eye className="w-4 h-4" />
																				</button>

																				{/* 상태 변경 드롭다운 */}
																				<div className="relative">
																					<Select
																						value={application.status}
																						onValueChange={(value) =>
																							handleStatusChange(
																								application.id,
																								value,
																							)
																						}
																						disabled={
																							updateApplicationStatusMutation.isPending
																						}
																					>
																						<SelectTrigger className="w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
																							<SelectValue />
																						</SelectTrigger>
																						<SelectContent>
																							{Object.entries(
																								APPLICATION_STATUS_LABELS,
																							).map(([value, label]) => (
																								<SelectItem
																									key={value}
																									value={value}
																								>
																									{label}
																								</SelectItem>
																							))}
																						</SelectContent>
																					</Select>
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															)
														},
													)}
												</div>

												{/* 일괄 작업 버튼들 */}
												{isManager && (
													<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
														<div className="flex flex-wrap gap-2">
															<button
																type="button"
																onClick={() =>
																	handleBulkStatusChange(
																		Enum.ApplicationStatus.WAITING,
																		Enum.ApplicationStatus.SELECTED,
																	)
																}
																disabled={
																	updateApplicationStatusMutation.isPending ||
																	!applicationListResult?.applicationList.some(
																		(app) =>
																			app.status ===
																			Enum.ApplicationStatus.WAITING,
																	)
																}
																className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer font-medium"
															>
																대기자 전체 선발
															</button>
															<button
																type="button"
																onClick={() =>
																	handleBulkStatusChange(
																		Enum.ApplicationStatus.WAITING,
																		Enum.ApplicationStatus.REJECTED,
																	)
																}
																disabled={
																	updateApplicationStatusMutation.isPending ||
																	!applicationListResult?.applicationList.some(
																		(app) =>
																			app.status ===
																			Enum.ApplicationStatus.WAITING,
																	)
																}
																className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer font-medium"
															>
																대기자 전체 불합격
															</button>
														</div>
													</div>
												)}
											</div>
										</div>
									</>
								)}
						</div>
					</div>

					{/* 신청 버튼 영역 */}
					{session?.user.id && (
						<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex justify-center">
								{/* 신청 가능한 경우 */}
								{canApply &&
									!isFullyBooked &&
									!hasApplied &&
									!cannotApplyDueToProfession && (
										<button
											type="button"
											onClick={handleApply}
											className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
										>
											신청하기
										</button>
									)}

								{/* 이미 신청한 경우 */}
								{hasApplied && (
									<button
										type="button"
										disabled
										className="bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
									>
										신청 완료
									</button>
								)}

								{/* 직업 관련 이유로 신청 불가능한 경우 */}
								{cannotApplyDueToProfession && !hasApplied && (
									<button
										type="button"
										disabled
										className="bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
										title={
											hasNoProfessions
												? '프로필에 직업을 1개 이상 등록해야 신청할 수 있습니다.'
												: '신청 가능한 직업이 없습니다. 이미 모든 직업으로 신청이 완료되었습니다.'
										}
									>
										{hasNoProfessions ? '직업 등록 필요' : '신청 불가'}
									</button>
								)}

								{/* 기타 이유로 신청 불가능한 경우 (마감, 정원 초과 등) */}
								{!canApply && !hasApplied && !cannotApplyDueToProfession && (
									<button
										type="button"
										disabled
										className="bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
									>
										{isDeadlinePassed
											? '마감됨'
											: isFullyBooked
												? '정원 마감'
												: '신청 불가'}
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 신청 모달 */}
			{isApplicationModalOpen && activity && (
				<ApplicationModal
					open={isApplicationModalOpen}
					onClose={handleCloseApplicationModal}
					volunteerActivityId={activity.id}
					volunteerActivityTitle={activity.title}
					onSuccess={handleApplicationSuccess}
				/>
			)}

			{/* 삭제 확인 모달 */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
							<AlertTriangle className="w-6 h-6" />
							봉사활동 삭제
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-4">
								{/* 메인 질문 */}
								<div className="text-gray-900 dark:text-gray-100 font-medium text-base">
									봉사활동을 삭제하시겠습니까?
								</div>

								{/* 상세 설명 */}
								<div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
									삭제된 봉사활동과 관련된 모든 신청 내역도 함께 삭제됩니다.
								</div>

								{/* 경고 메시지 */}
								<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
									<div className="flex items-center gap-2">
										<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
										<span className="text-red-800 dark:text-red-200 font-semibold text-sm">
											이 작업은 되돌릴 수 없습니다.
										</span>
									</div>
								</div>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={handleDeleteCancel}
							className={'cursor-pointer'}
						>
							취소
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={deleteVolunteerActivityMutation.isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
						>
							{deleteVolunteerActivityMutation.isPending
								? '삭제 중...'
								: '삭제'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default VolunteerActivityDetailPage
