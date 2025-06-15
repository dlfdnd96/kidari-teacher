'use client'

import React, { FC } from 'react'
import { Calendar, MapPin, User, Phone, FileText, Clock, X } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ApplicationDetailModalProps } from '@/types/application'
import {
	APPLICATION_STATUS_LABELS,
	APPLICATION_STATUS_COLORS,
	APPLICATION_STATUS_DESCRIPTIONS,
} from '@/types/application'
import { Enum } from '@/enums'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'

const ApplicationDetailModal: FC<ApplicationDetailModalProps> = ({
	open,
	onClose,
	application,
	onUpdateStatus,
	onDelete,
	currentUserId,
	userRole,
}) => {
	if (!open || !application || !application.volunteerActivity) {
		return null
	}

	const statusColor =
		APPLICATION_STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'
	const statusLabel =
		APPLICATION_STATUS_LABELS[application.status] || application.status
	const statusDescription =
		APPLICATION_STATUS_DESCRIPTIONS[application.status] || ''

	const isMyApplication = currentUserId === application.userId
	const isAdmin = userRole === Enum.Role.ADMIN
	const canCancel =
		application.status === Enum.ApplicationStatus.WAITING &&
		new TZDate(new Date(), TIME_ZONE.UTC) <
			new TZDate(application.volunteerActivity.startAt, TIME_ZONE.UTC)

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
					className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95 cursor-pointer"
				>
					<X className="w-6 h-6" />
				</button>

				{/* 헤더 */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl p-6 sm:p-8 pr-16 sm:pr-20">
					<div className="flex items-start">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
									{application.volunteerActivity.title}
								</h2>
								<div
									className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor.replace('bg-', 'bg-white/20 ').replace('text-', 'text-white ')}`}
								>
									{statusLabel}
								</div>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-blue-100">
								<div className="flex items-center">
									<User className="w-4 h-4 mr-2" />
									<span className="text-sm font-medium">
										{application.user?.name || '사용자'}
									</span>
								</div>
								<div className="flex items-center">
									<Clock className="w-4 h-4 mr-2" />
									<time className="text-sm">
										신청일:{' '}
										{format(
											new TZDate(application.createdAt, TIME_ZONE.SEOUL),
											'yyyy년 M월 d일',
											{
												locale: ko,
											},
										)}
									</time>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 내용 */}
				<div className="flex-1 p-6 sm:p-8 overflow-y-auto">
					<div className="space-y-6">
						{/* 신청 상태 안내 */}
						<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
							<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
								신청 상태
							</h3>
							<p className="text-blue-800 dark:text-blue-200">
								{statusDescription}
							</p>
						</div>

						{/* 봉사활동 정보 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* 일시 */}
							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
								<div>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										활동 일시
									</div>
									<div className="text-gray-700 dark:text-gray-300">
										{format(
											new TZDate(
												application.volunteerActivity.startAt,
												TIME_ZONE.SEOUL,
											),
											'yyyy년 M월 d일 (E) HH:mm',
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
									</div>
								</div>
							</div>

							{/* 장소 */}
							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
								<div>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										활동 장소
									</div>
									<div className="text-gray-700 dark:text-gray-300">
										{application.volunteerActivity.location}
									</div>
								</div>
							</div>

							{/* 담당자 */}
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
								<div>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										담당자
									</div>
									<div className="text-gray-700 dark:text-gray-300">
										{application.volunteerActivity.manager?.name || '관리자'}
									</div>
								</div>
							</div>

							{/* 긴급연락처 */}
							<div className="flex items-start gap-3">
								<Phone className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
								<div>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										긴급연락처
									</div>
									<div className="text-gray-700 dark:text-gray-300">
										{application.emergencyContact}
									</div>
								</div>
							</div>
						</div>

						{/* 구분선 */}
						<div className="border-t border-gray-200 dark:border-gray-700"></div>

						{/* 활동 설명 */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-blue-600" />
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">
									활동 설명
								</h3>
							</div>
							<div className="prose prose-gray dark:prose-invert max-w-none">
								<div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
									{application.volunteerActivity.description}
								</div>
							</div>
						</div>

						{/* 관리자용 상태 변경 섹션 */}
						{isAdmin && (
							<>
								<div className="border-t border-gray-200 dark:border-gray-700"></div>
								<div className="space-y-3">
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">
										관리자 액션
									</h3>
									<div className="flex gap-2 flex-wrap">
										{application.status === Enum.ApplicationStatus.WAITING && (
											<>
												<button
													onClick={() =>
														onUpdateStatus?.(
															application.id,
															Enum.ApplicationStatus.SELECTED,
														)
													}
													className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
												>
													선발하기
												</button>
												<button
													onClick={() =>
														onUpdateStatus?.(
															application.id,
															Enum.ApplicationStatus.REJECTED,
														)
													}
													className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
												>
													불합격 처리
												</button>
											</>
										)}
										{application.status === Enum.ApplicationStatus.SELECTED && (
											<button
												onClick={() =>
													onUpdateStatus?.(
														application.id,
														Enum.ApplicationStatus.WAITING,
													)
												}
												className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
											>
												대기 상태로 변경
											</button>
										)}
										{application.status === Enum.ApplicationStatus.REJECTED && (
											<button
												onClick={() =>
													onUpdateStatus?.(
														application.id,
														Enum.ApplicationStatus.WAITING,
													)
												}
												className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
											>
												대기 상태로 변경
											</button>
										)}
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

						{/* 취소 버튼 (본인 신청이고 취소 가능한 경우) */}
						{isMyApplication && canCancel && (
							<button
								onClick={() => onDelete?.(application)}
								className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
							>
								신청 취소
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ApplicationDetailModal
