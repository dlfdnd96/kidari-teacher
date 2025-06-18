'use client'

import React, { FC, useCallback, useState, useEffect } from 'react'
import {
	AlertCircle,
	Calendar,
	ChevronDown,
	Clock,
	Eye,
	FileText,
	Mail,
	MapPin,
	Phone,
	User,
	Users,
	X,
} from 'lucide-react'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { VolunteerActivityDetailModalProps } from '@/types/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
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
import { formatPhoneNumber } from '@/utils/phone'

const VolunteerActivityDetailModal: FC<VolunteerActivityDetailModalProps> = ({
	open,
	onClose,
	activity,
	onApply,
	currentUserId,
	userRole,
}) => {
	const { showError } = useErrorModal()

	const [applications, setApplications] = useState(activity.applications ?? [])

	useEffect(() => {
		setApplications(activity.applications ?? [])
	}, [activity.applications])

	const utils = trpc.useUtils()

	const updateApplicationStatusMutation =
		trpc.application.updateApplicationStatus.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.volunteerActivity.getVolunteerActivityList.invalidate(),
					utils.application.getMyApplicationList.invalidate(),
				])
			},
			onError: (error) => {
				setApplications(activity.applications ?? [])
				showError(error.message, '봉사활동 상태 수정 오류')
			},
		})

	const handleStatusChange = useCallback(
		async (applicationId: string, newStatus: string) => {
			try {
				const parsedNewStatus = ZodEnum.ApplicationStatus.parse(newStatus)

				setApplications((prev) =>
					prev.map((app) =>
						app.id === applicationId
							? { ...app, status: parsedNewStatus }
							: app,
					),
				)

				await updateApplicationStatusMutation.mutateAsync({
					id: applicationId,
					status: parsedNewStatus,
				})
			} catch (error) {
				console.error('Status update error:', error)

				const errorMessage =
					error instanceof Error
						? error.message
						: '알 수 없는 오류가 발생했습니다.'

				showError(errorMessage, '봉사활동 상태 수정 오류')
			}
		},
		[showError, updateApplicationStatusMutation],
	)

	const handleBulkStatusChange = useCallback(
		async (targetStatus: string, newStatus: string) => {
			try {
				const parsedNewStatus = ZodEnum.ApplicationStatus.parse(newStatus)
				const parsedTargetStatus = ZodEnum.ApplicationStatus.parse(targetStatus)

				const applicationsToUpdate = applications.filter(
					(app) => app.status === parsedTargetStatus,
				)

				if (applicationsToUpdate.length === 0) {
					return
				}

				setApplications((prev) =>
					prev.map((app) =>
						app.status === parsedTargetStatus
							? { ...app, status: parsedNewStatus }
							: app,
					),
				)

				await Promise.all(
					applicationsToUpdate.map((app) =>
						updateApplicationStatusMutation.mutateAsync({
							id: app.id,
							status: parsedNewStatus,
						}),
					),
				)
			} catch (error) {
				console.error('Bulk status update error:', error)

				setApplications(activity.applications ?? [])

				const errorMessage =
					error instanceof Error
						? error.message
						: '일괄 상태 변경 중 오류가 발생했습니다.'

				showError(errorMessage, '봉사활동 상태 수정 오류')
			}
		},
		[
			applications,
			updateApplicationStatusMutation,
			showError,
			activity.applications,
		],
	)

	if (!open || !activity) {
		return null
	}

	const isManager =
		currentUserId === activity.managerId || userRole === Enum.Role.ADMIN
	const canApply =
		activity.status === Enum.VolunteerActivityStatus.RECRUITING &&
		startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) <=
			startOfDay(activity.applicationDeadline)

	const hasApplied = currentUserId
		? applications?.some((app) => app.user?.id === currentUserId)
		: false

	const applicationCount = applications?.length || 0
	const maxParticipants = activity.maxParticipants || 0
	const isFullyBooked =
		maxParticipants > 0 && applicationCount >= maxParticipants

	const statusColor =
		VOLUNTEER_ACTIVITY_STATUS_COLORS[activity.status] ||
		'bg-gray-100 text-gray-800'
	const statusLabel =
		VOLUNTEER_ACTIVITY_STATUS_LABELS[activity.status] || activity.status

	const isDeadlinePassed =
		startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL)) >
		startOfDay(activity.applicationDeadline)

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden relative flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					aria-label="모달 닫기"
					className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-95 cursor-pointer"
				>
					<X className="w-6 h-6" />
				</button>

				{/* 헤더 */}
				<div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-t-3xl p-6 sm:p-8 pr-16 sm:pr-20">
					<div className="flex items-start">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
									{activity.title}
								</h2>
								<div
									className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
								>
									{statusLabel}
								</div>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-emerald-100">
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
				</div>

				{/* 내용 */}
				<div className="flex-1 p-6 sm:p-8 overflow-y-auto">
					<div className="space-y-6">
						{/* 기본 정보 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* 일시 */}
							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
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
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
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
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										신청 현황
									</div>
									<div className="flex items-center gap-2">
										<span className="text-gray-700 dark:text-gray-300">
											{applicationCount}명
											{maxParticipants > 0 && ` / ${maxParticipants}명`}
										</span>
										{isFullyBooked && (
											<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
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
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
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
											<span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
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
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-emerald-600" />
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">
									활동 설명
								</h3>
							</div>
							<div className="prose prose-gray dark:prose-invert max-w-none">
								<div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
									{activity.description}
								</div>
							</div>
						</div>

						{/* 신청 안내 */}
						{currentUserId && (
							<>
								<div className="border-t border-gray-200 dark:border-gray-700"></div>
								<div className="space-y-3">
									{hasApplied ? (
										<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
											<div className="flex items-center">
												<AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
												<span className="text-green-800 dark:text-green-200 font-medium">
													이미 이 봉사활동에 신청하셨습니다.
												</span>
											</div>
										</div>
									) : !canApply ? (
										<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
											<div className="flex items-center">
												<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
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
												<AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
												<span className="text-emerald-800 dark:text-emerald-200 font-medium">
													신청 버튼을 클릭하여 이 봉사활동에 참여 신청하세요.
												</span>
											</div>
										</div>
									)}
								</div>
							</>
						)}

						{/* 관리자용 신청자 관리 섹션 */}
						{isManager && applications && applications.length > 0 && (
							<>
								<div className="border-t border-gray-200 dark:border-gray-700"></div>
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<Users className="h-5 w-5 text-blue-600" />
										<h3 className="font-semibold text-gray-900 dark:text-gray-100">
											신청자 관리 ({applications.length}명)
										</h3>
									</div>

									<div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
										<div className="space-y-3">
											{applications.map((application) => {
												const statusColor =
													APPLICATION_STATUS_COLORS[application.status] ||
													'bg-gray-100 text-gray-800'
												const statusLabel =
													APPLICATION_STATUS_LABELS[application.status] ||
													application.status

												return (
													<div
														key={application.id}
														className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
													>
														<div className="flex items-center justify-between">
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-3 mb-2">
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
																			{application.user?.email || '이메일 없음'}
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

															<div className="flex items-center gap-2 ml-4">
																{/* 신청 상세 보기 버튼 */}
																<button
																	className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
																	title="상세 보기"
																>
																	<Eye className="w-4 h-4" />
																</button>

																{/* 상태 변경 드롭다운 */}
																<div className="relative">
																	<select
																		value={application.status}
																		onChange={(e) =>
																			handleStatusChange(
																				application.id,
																				e.target.value,
																			)
																		}
																		disabled={
																			updateApplicationStatusMutation.isPending
																		}
																		className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
																	>
																		<option value="WAITING">대기 중</option>
																		<option value="SELECTED">선발됨</option>
																		<option value="REJECTED">불합격</option>
																		<option value="CANCELLED">취소됨</option>
																	</select>
																	<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
																</div>
															</div>
														</div>
													</div>
												)
											})}
										</div>

										{/* 일괄 작업 버튼들 */}
										<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
											<div className="flex flex-wrap gap-2">
												<button
													onClick={() =>
														handleBulkStatusChange(
															Enum.ApplicationStatus.WAITING,
															Enum.ApplicationStatus.SELECTED,
														)
													}
													disabled={
														updateApplicationStatusMutation.isPending ||
														!applications.some(
															(app) =>
																app.status === Enum.ApplicationStatus.WAITING,
														)
													}
													className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer"
												>
													대기자 전체 선발
												</button>
												<button
													onClick={() =>
														handleBulkStatusChange(
															Enum.ApplicationStatus.WAITING,
															Enum.ApplicationStatus.REJECTED,
														)
													}
													disabled={
														updateApplicationStatusMutation.isPending ||
														!applications.some(
															(app) =>
																app.status === Enum.ApplicationStatus.WAITING,
														)
													}
													className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors cursor-pointer"
												>
													대기자 전체 불합격
												</button>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* 푸터 */}
				<div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-b-3xl shrink-0">
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<button
							onClick={onClose}
							className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 cursor-pointer"
						>
							닫기
						</button>

						{/* 신청 버튼 - 조건 분리 */}
						{currentUserId && (
							<>
								{/* 신청 가능한 경우 */}
								{canApply && !isFullyBooked && !hasApplied && (
									<button
										onClick={() => onApply?.(activity)}
										className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
									>
										신청하기
									</button>
								)}

								{/* 이미 신청한 경우 */}
								{hasApplied && (
									<button
										disabled
										className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
									>
										신청 완료
									</button>
								)}

								{/* 신청 불가능한 경우 (마감, 정원 초과 등) */}
								{!canApply && !hasApplied && (
									<button
										disabled
										className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
									>
										{isDeadlinePassed
											? '마감됨'
											: isFullyBooked
												? '정원 마감'
												: '신청 불가'}
									</button>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default VolunteerActivityDetailModal
