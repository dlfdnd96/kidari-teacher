'use client'

import { useState } from 'react'
import {
	Calendar,
	MapPin,
	Users,
	Clock,
	User,
	FileText,
	Package,
	AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { VolunteerActivityWithDetails } from '@/types/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VOLUNTEER_ACTIVITY_STATUS_COLORS,
} from '@/types/volunteer-activity'

interface VolunteerActivityDetailModalProps {
	activity: VolunteerActivityWithDetails | null
	isOpen: boolean
	onClose: () => void
	onApply?: (activity: VolunteerActivityWithDetails) => void
	onEdit?: (activity: VolunteerActivityWithDetails) => void
	currentUserId?: string
	userRole?: 'USER' | 'ADMIN'
}

export default function VolunteerActivityDetailModal({
	activity,
	isOpen,
	onClose,
	onApply,
	onEdit,
	currentUserId,
	userRole,
}: VolunteerActivityDetailModalProps) {
	if (!activity) return null

	const isManager = currentUserId === activity.managerId || userRole === 'ADMIN'
	const canApply =
		activity.status === 'RECRUITING' &&
		new Date() <= new Date(activity.applicationDeadline)

	const hasApplied = currentUserId
		? activity.applications.some((app) => app.user.id === currentUserId)
		: false

	const applicationCount = activity._count.applications
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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<div className="flex items-start justify-between gap-4">
						<DialogTitle className="text-xl font-bold leading-tight">
							{activity.title}
						</DialogTitle>
						<Badge className={`${statusColor} shrink-0`}>{statusLabel}</Badge>
					</div>
				</DialogHeader>

				<ScrollArea className="flex-1 pr-4">
					<div className="space-y-6">
						{/* 기본 정보 */}
						<div className="space-y-4">
							{/* 일시 */}
							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
								<div>
									<div className="font-medium">활동 일시</div>
									<div className="text-lg">
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
								<MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
								<div>
									<div className="font-medium">활동 장소</div>
									<div className="text-lg">{activity.location}</div>
								</div>
							</div>

							{/* 신청 현황 */}
							<div className="flex items-start gap-3">
								<Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
								<div className="flex-1">
									<div className="font-medium">신청 현황</div>
									<div className="flex items-center gap-2">
										<span className="text-lg">
											{applicationCount}명
											{maxParticipants > 0 && ` / ${maxParticipants}명`}
										</span>
										{isFullyBooked && <Badge variant="secondary">마감</Badge>}
									</div>
								</div>
							</div>

							{/* 신청 마감일 */}
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
								<div>
									<div className="font-medium">신청 마감일</div>
									<div className="flex items-center gap-2">
										<span className="text-lg">
											{format(
												new Date(activity.applicationDeadline),
												'yyyy년 M월 d일 (E)',
												{ locale: ko },
											)}
										</span>
										{isDeadlinePassed && (
											<Badge variant="destructive">마감됨</Badge>
										)}
									</div>
								</div>
							</div>

							{/* 담당자 */}
							<div className="flex items-start gap-3">
								<User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
								<div>
									<div className="font-medium">담당자</div>
									<div className="text-lg">{activity.manager.name}</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* 활동 설명 */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-semibold">활동 설명</h3>
							</div>
							<div className="whitespace-pre-wrap text-sm leading-relaxed pl-7">
								{activity.description}
							</div>
						</div>

						{/* 참가 자격 */}
						{activity.qualifications && (
							<>
								<Separator />
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<AlertCircle className="h-5 w-5 text-muted-foreground" />
										<h3 className="font-semibold">참가 자격</h3>
									</div>
									<div className="whitespace-pre-wrap text-sm leading-relaxed pl-7">
										{activity.qualifications}
									</div>
								</div>
							</>
						)}

						{/* 준비물 */}
						{activity.materials && (
							<>
								<Separator />
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Package className="h-5 w-5 text-muted-foreground" />
										<h3 className="font-semibold">준비물</h3>
									</div>
									<div className="whitespace-pre-wrap text-sm leading-relaxed pl-7">
										{activity.materials}
									</div>
								</div>
							</>
						)}

						{/* 신청 안내 */}
						{currentUserId && !isManager && (
							<>
								<Separator />
								<div className="space-y-3">
									{hasApplied ? (
										<Alert>
											<AlertCircle className="h-4 w-4" />
											<AlertDescription>
												이미 이 봉사활동에 신청하셨습니다.
											</AlertDescription>
										</Alert>
									) : !canApply ? (
										<Alert variant="destructive">
											<AlertCircle className="h-4 w-4" />
											<AlertDescription>
												{isDeadlinePassed
													? '신청 마감일이 지났습니다.'
													: isFullyBooked
														? '모집 정원이 마감되었습니다.'
														: '현재 신청을 받지 않는 상태입니다.'}
											</AlertDescription>
										</Alert>
									) : (
										<Alert>
											<AlertCircle className="h-4 w-4" />
											<AlertDescription>
												신청 버튼을 클릭하여 이 봉사활동에 참여 신청하세요.
											</AlertDescription>
										</Alert>
									)}
								</div>
							</>
						)}
					</div>
				</ScrollArea>

				<DialogFooter className="flex flex-col sm:flex-row gap-2">
					<Button variant="outline" onClick={onClose} className="flex-1">
						닫기
					</Button>

					{/* 신청 버튼 (로그인된 일반 사용자, 신청 가능한 상태) */}
					{currentUserId && !isManager && canApply && !isFullyBooked && (
						<Button
							className="flex-1"
							onClick={() => onApply?.(activity)}
							disabled={hasApplied}
						>
							{hasApplied ? '신청 완료' : '신청하기'}
						</Button>
					)}

					{/* 수정 버튼 (관리자 또는 매니저) */}
					{isManager && (
						<Button
							variant="default"
							className="flex-1"
							onClick={() => onEdit?.(activity)}
						>
							수정하기
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
