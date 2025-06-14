'use client'

import React, { FC } from 'react'
import {
	Calendar,
	MapPin,
	Users,
	Clock,
	User,
	FileText,
	Package,
	AlertCircle,
	X,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { VolunteerActivityDetailModalProps } from '@/types/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
} from '@/types/volunteer-activity'

const VolunteerActivityDetailModal: FC<VolunteerActivityDetailModalProps> = ({
	open,
	onClose,
	activity,
	onApply,
	onEdit,
	currentUserId,
	userRole,
}) => {
	if (!open || !activity) {
		return null
	}

	const isManager = currentUserId === activity.managerId || userRole === 'ADMIN'
	const canApply =
		activity.status === 'RECRUITING' &&
		new Date() <= new Date(activity.applicationDeadline)

	const hasApplied = currentUserId
		? activity.applications?.some((app) => app.user?.id === currentUserId)
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

	const isDeadlinePassed = new Date() > new Date(activity.applicationDeadline)

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
											new Date(activity.startAt),
											'yyyy년 M월 d일 (E) HH:mm',
											{ locale: ko },
										)}
										{activity.startAt !== activity.endAt && (
											<>
												{' '}
												~{' '}
												{format(new Date(activity.endAt), 'HH:mm', {
													locale: ko,
												})}
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
												new Date(activity.applicationDeadline),
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

						{/* 참가 자격 */}
						{activity.qualifications && (
							<>
								<div className="border-t border-gray-200 dark:border-gray-700"></div>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<AlertCircle className="h-5 w-5 text-amber-600" />
										<h3 className="font-semibold text-gray-900 dark:text-gray-100">
											참가 자격
										</h3>
									</div>
									<div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
										{activity.qualifications}
									</div>
								</div>
							</>
						)}

						{/* 준비물 */}
						{activity.materials && (
							<>
								<div className="border-t border-gray-200 dark:border-gray-700"></div>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Package className="h-5 w-5 text-blue-600" />
										<h3 className="font-semibold text-gray-900 dark:text-gray-100">
											준비물
										</h3>
									</div>
									<div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
										{activity.materials}
									</div>
								</div>
							</>
						)}

						{/* 신청 안내 */}
						{currentUserId && !isManager && (
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

						{/* 신청 버튼 */}
						{currentUserId && !isManager && canApply && !isFullyBooked && (
							<button
								onClick={() => onApply?.(activity)}
								disabled={hasApplied}
								className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								{hasApplied ? '신청 완료' : '신청하기'}
							</button>
						)}

						{/* 수정 버튼 */}
						{isManager && (
							<button
								onClick={() => onEdit?.(activity)}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
							>
								수정하기
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default VolunteerActivityDetailModal
