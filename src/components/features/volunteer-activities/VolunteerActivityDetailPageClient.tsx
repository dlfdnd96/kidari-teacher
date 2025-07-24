'use client'

import React, { FC, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	AlertCircle,
	AlertTriangle,
	Calendar,
	Clock,
	Edit,
	Eye,
	FileText,
	Mail,
	MapPin,
	MoreHorizontal,
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
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import dynamic from 'next/dynamic'
import { useVolunteerActivityActions } from './hooks'

const ApplicationModal = dynamic(
	() => import('@/components/features/applications/ApplicationModal'),
	{
		ssr: false,
		loading: () => null,
	},
)

const VolunteerActivityDetailPageClient: FC<VolunteerActivityDetailProps> = ({
	id,
}) => {
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()
	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const { getVolunteerActivityQuery, deleteVolunteerActivityMutation } =
		useVolunteerActivityActions()

	const utils = trpc.useUtils()

	const { data: activity, isLoading: isActivityLoading } =
		getVolunteerActivityQuery(
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
								<div className="flex items-center justify-between">
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
									{/* 더보기 메뉴 */}
									{(isManager || isWriter) && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={handleEditClick}
													className="cursor-pointer"
													data-cy="edit-button"
												>
													<Edit className="w-4 h-4 mr-2" />
													수정하기
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={handleDeleteClick}
													className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
													data-cy="delete-button"
												>
													<Trash2 className="w-4 h-4 mr-2" />
													삭제하기
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
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
										{hasApplied && (
											<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
												<div className="flex items-center">
													<AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
													<span className="text-green-800 dark:text-green-200 font-medium">
														이미 이 봉사활동에 신청하셨습니다.
													</span>
												</div>
											</div>
										)}
										{cannotApplyDueToProfession && !hasApplied && (
											<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
												<div className="flex items-center">
													<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
													<span className="text-red-800 dark:text-red-200 font-medium">
														{hasNoProfessions
															? '프로필에 직업을 1개 이상 등록해야 신청할 수 있습니다.'
															: '신청 가능한 직업이 없습니다. 이미 모든 직업으로 신청이 완료되었습니다.'}
													</span>
												</div>
											</div>
										)}
										{!canApply &&
											!hasApplied &&
											!cannotApplyDueToProfession && (
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
																				<Button
																					type="button"
																					variant="ghost"
																					size="icon"
																					className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors h-auto"
																					title="상세 보기"
																				>
																					<Eye className="w-4 h-4" />
																				</Button>

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
															<Button
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
																className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer font-medium border-0 h-auto"
															>
																대기자 전체 선발
															</Button>
															<Button
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
																className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer font-medium border-0 h-auto"
															>
																대기자 전체 불합격
															</Button>
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
										<Button
											type="button"
											onClick={handleApply}
											className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer border-0 h-auto"
										>
											<span>신청하기</span>
										</Button>
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
							data-cy="cancel-delete-volunteer-activity-button"
						>
							취소
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={deleteVolunteerActivityMutation.isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
							data-cy="delete-volunteer-activity-button"
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

export default VolunteerActivityDetailPageClient
