'use client'

import React, { memo, useCallback, useState } from 'react'
import {
	AlertCircle,
	AlertTriangle,
	Calendar,
	Clock,
	MapPin,
	X,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { CLIENT_ERROR_KEY_MAPPING, handleClientError } from '@/utils/error'
import { trpc } from '@/components/providers/TrpcProvider'
import {
	APPLICATION_STATUS_COLORS,
	APPLICATION_STATUS_LABELS,
	MyApplicationListProps,
	MyApplicationListRowProps,
} from '@/types/application'
import { TZDate } from '@date-fns/tz'
import { Enum } from '@/enums'
import { TIME_ZONE } from '@/constants/date'
import { useSession } from 'next-auth/react'
import { PROFESSION_LABELS } from '@/constants/user-profile'
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui'

const ApplicationRow = memo(({ application }: MyApplicationListRowProps) => {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const router = useRouter()
	const { data: session } = useSession()
	const { showError } = useErrorModal()

	const utils = trpc.useUtils()

	const cancelApplicationMutation =
		trpc.application.deleteApplication.useMutation({
			onSuccess: async () => {
				await Promise.all([
					utils.application.getMyApplicationList.invalidate(),
					utils.volunteerActivity.getVolunteerActivityList.invalidate(),
					utils.application.getApplicationList.invalidate(),
				])
				router.refresh()
			},
			onError: (error) => {
				handleClientError(error, showError, '봉사활동 신청 취소 오류')
			},
			onSettled: () => {
				setIsDeleteDialogOpen(false)
			},
		})

	const handleRowClick = useCallback(() => {
		if (application.volunteerActivity?.id) {
			router.push(`/volunteer-activities/${application.volunteerActivity.id}`)
		}
	}, [router, application.volunteerActivity?.id])

	const handleCancel = useCallback(async () => {
		if (!session?.user) {
			handleClientError(
				CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
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
			setIsDeleteDialogOpen(false)
		}
	}, [session, showError, cancelApplicationMutation, application.id])

	if (!application.volunteerActivity) {
		return null
	}

	const statusColor =
		APPLICATION_STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'
	const statusLabel =
		APPLICATION_STATUS_LABELS[application.status] || application.status

	const canCancel =
		application.status === Enum.ApplicationStatus.WAITING &&
		new TZDate(new Date(), TIME_ZONE.UTC) <
			new TZDate(application.volunteerActivity.startAt, TIME_ZONE.UTC)

	const isCanceling = cancelApplicationMutation.isPending

	return (
		<>
			<TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
				{/* 상태 */}
				<TableCell className="text-center">
					<div
						className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
					>
						{statusLabel}
					</div>
				</TableCell>

				{/* 봉사활동명 */}
				<TableCell className="font-medium text-center">
					<div className="max-w-xs mx-auto">
						<div
							className="truncate text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
							onClick={handleRowClick}
						>
							{application.volunteerActivity.title}
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{PROFESSION_LABELS[application.profession]}
						</div>
					</div>
				</TableCell>

				{/* 신청일 */}
				<TableCell className="text-center">
					<div className="flex items-center justify-center gap-1 text-sm">
						<Clock className="w-3 h-3 text-gray-400" />
						{format(new TZDate(application.createdAt, TIME_ZONE.SEOUL), 'M/d', {
							locale: ko,
						})}
					</div>
				</TableCell>

				{/* 활동일시 */}
				<TableCell className="text-center">
					<div className="flex items-center justify-center gap-1 text-sm">
						<Calendar className="w-3 h-3 text-gray-400" />
						{format(
							new TZDate(
								application.volunteerActivity.startAt,
								TIME_ZONE.SEOUL,
							),
							'M/d (E)',
							{ locale: ko },
						)}
					</div>
				</TableCell>

				{/* 장소 */}
				<TableCell className="text-center">
					<div className="flex items-center justify-center gap-1 text-sm max-w-xs mx-auto">
						<MapPin className="w-3 h-3 text-gray-400 shrink-0" />
						<span className="truncate">
							{application.volunteerActivity.location}
						</span>
					</div>
				</TableCell>

				{/* 액션 */}
				<TableCell className="text-center">
					{canCancel && (
						<Button
							variant="destructive"
							size="sm"
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleteDialogOpen(true)
							}}
							aria-label="신청 취소"
							disabled={isCanceling}
							className="h-8 px-2 text-xs cursor-pointer"
						>
							<X className="w-3 h-3" />
							<span>취소</span>
						</Button>
					)}
				</TableCell>
			</TableRow>

			{/* 신청 취소 확인 모달 */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
							<AlertTriangle className="w-6 h-6" />
							봉사활동 신청 취소
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-4">
								{/* 메인 질문 */}
								<div className="text-gray-900 dark:text-gray-100 font-medium text-base">
									봉사활동 신청을 취소하시겠습니까?
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
							onClick={() => setIsDeleteDialogOpen(false)}
							className={'cursor-pointer'}
						>
							취소
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleCancel}
							disabled={cancelApplicationMutation.isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
						>
							{cancelApplicationMutation.isPending ? '취소 중...' : '신청 취소'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
})

ApplicationRow.displayName = 'ApplicationRow'

export default function MyApplicationList({
	applications,
	isLoading = false,
}: MyApplicationListProps) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{/* 테이블 스켈레톤 */}
				<div className="rounded-md border border-gray-200 dark:border-gray-700">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-20">상태</TableHead>
								<TableHead className="w-60">봉사활동명</TableHead>
								<TableHead className="w-20">신청일</TableHead>
								<TableHead className="w-24">활동일시</TableHead>
								<TableHead className="w-40">장소</TableHead>
								<TableHead className="w-16">액션</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[1, 2, 3, 4, 5].map((i) => (
								<TableRow key={i}>
									{[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
										<TableCell key={j}>
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{/* 테이블 */}
			<div className="rounded-md border border-gray-200 dark:border-gray-700">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-20 text-center">상태</TableHead>
							<TableHead className="w-60 text-center">봉사활동명</TableHead>
							<TableHead className="w-20 text-center">신청일</TableHead>
							<TableHead className="w-24 text-center">활동일시</TableHead>
							<TableHead className="w-40 text-center">장소</TableHead>
							<TableHead className="w-16 text-center">액션</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{applications.length > 0 ? (
							applications.map((application) => (
								<ApplicationRow
									key={application.id}
									application={application}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-12">
									<div className="flex flex-col items-center">
										<div className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
											신청한 봉사활동이 없습니다
										</div>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
