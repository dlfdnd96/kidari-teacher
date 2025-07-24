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
import { TZDate } from '@date-fns/tz'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { handleClientError } from '@/utils/error'
import {
	APPLICATION_STATUS_COLORS,
	APPLICATION_STATUS_LABELS,
	MyApplicationCancelDialogProps,
	MyApplicationCellProps,
	MyApplicationListProps,
	MyApplicationListRowProps,
} from '@/types/application'
import { Enum } from '@/enums'
import { TIME_ZONE } from '@/constants/date'
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
import { useApplicationActions } from '@/components/features/applications/hooks'

const StatusCell = memo(
	({ application }: Pick<MyApplicationCellProps, 'application'>) => {
		const statusColor =
			APPLICATION_STATUS_COLORS[application.status] ||
			'bg-gray-100 text-gray-800'
		const statusLabel =
			APPLICATION_STATUS_LABELS[application.status] || application.status

		return (
			<TableCell className="text-center" data-cy="application-status">
				<div
					className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
				>
					{statusLabel}
				</div>
			</TableCell>
		)
	},
)

StatusCell.displayName = 'StatusCell'

const TitleCell = memo(
	({ application, onRowClick }: MyApplicationCellProps) => {
		return (
			<TableCell
				className="font-medium text-center"
				data-cy="application-title"
			>
				<div className="max-w-xs mx-auto">
					<div
						className="truncate text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						onClick={onRowClick}
					>
						{application.volunteerActivity?.title}
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
						{PROFESSION_LABELS[application.profession]}
					</div>
				</div>
			</TableCell>
		)
	},
)

TitleCell.displayName = 'TitleCell'

const DateCell = memo(
	({
		date,
		icon: Icon,
		testId,
	}: {
		date: Date
		icon: React.ComponentType<{ className?: string }>
		testId: string
	}) => {
		return (
			<TableCell className="text-center" data-cy={testId}>
				<div className="flex items-center justify-center gap-1 text-sm">
					<Icon className="w-3 h-3 text-gray-400" />
					{format(
						new TZDate(date, TIME_ZONE.SEOUL),
						testId === 'application-created-at' ? 'M/d' : 'M/d (E)',
						{
							locale: ko,
						},
					)}
				</div>
			</TableCell>
		)
	},
)

DateCell.displayName = 'DateCell'

const LocationCell = memo(({ location }: { location: string }) => {
	return (
		<TableCell className="text-center" data-cy="application-location">
			<div className="flex items-center justify-center gap-1 text-sm max-w-xs mx-auto">
				<MapPin className="w-3 h-3 text-gray-400 shrink-0" />
				<span className="truncate">{location}</span>
			</div>
		</TableCell>
	)
})

LocationCell.displayName = 'LocationCell'

interface ActionCellProps {
	canCancel: boolean
	isCanceling: boolean
	onCancelClick: (e: React.MouseEvent) => void
}

const ActionCell = memo(
	({ canCancel, isCanceling, onCancelClick }: ActionCellProps) => {
		return (
			<TableCell className="text-center" data-cy="application-action">
				{canCancel && (
					<Button
						variant="destructive"
						size="sm"
						onClick={onCancelClick}
						aria-label="신청 취소"
						disabled={isCanceling}
						className="h-8 px-2 text-xs cursor-pointer"
						data-cy="cancel-application-button"
					>
						<X className="w-3 h-3" />
						<span>취소</span>
					</Button>
				)}
			</TableCell>
		)
	},
)

ActionCell.displayName = 'ActionCell'

const CancelDialog = memo(
	({
		isOpen,
		isPending,
		onOpenChange,
		onConfirm,
	}: MyApplicationCancelDialogProps) => {
		return (
			<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
				<AlertDialogContent data-cy="cancel-application-alert-dialog">
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
							<AlertTriangle className="w-6 h-6" />
							봉사활동 신청 취소
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-4">
								<div className="text-gray-900 dark:text-gray-100 font-medium text-base">
									봉사활동 신청을 취소하시겠습니까?
								</div>
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
							onClick={() => onOpenChange(false)}
							className="cursor-pointer"
							data-cy="cancel-application-cancel-button"
						>
							취소
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={onConfirm}
							disabled={isPending}
							className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
							data-cy="confirm-application-cancel-button"
						>
							{isPending ? '취소 중...' : '신청 취소'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	},
)

CancelDialog.displayName = 'CancelDialog'

const ApplicationRow = memo(({ application }: MyApplicationListRowProps) => {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const router = useRouter()
	const { showError } = useErrorModal()

	const { checkAuthentication, cancelApplicationMutation } =
		useApplicationActions()

	const handleRowClick = useCallback(() => {
		if (application.volunteerActivity?.id) {
			router.push(`/volunteer-activities/${application.volunteerActivity.id}`)
		}
	}, [router, application.volunteerActivity?.id])

	const handleCancel = useCallback(async () => {
		if (!checkAuthentication()) {
			return
		}

		try {
			await cancelApplicationMutation.mutateAsync({
				id: application.id,
			})
		} catch (error) {
			handleClientError(error, showError, '봉사활동 신청 취소 오류')
		} finally {
			setIsDeleteDialogOpen(false)
		}
	}, [
		checkAuthentication,
		cancelApplicationMutation,
		application.id,
		showError,
	])

	const handleCancelClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsDeleteDialogOpen(true)
	}, [])

	if (!application.volunteerActivity) {
		return null
	}

	const canCancel =
		application.status === Enum.ApplicationStatus.WAITING &&
		new TZDate(new Date(), TIME_ZONE.UTC) <
			new TZDate(application.volunteerActivity.startAt, TIME_ZONE.UTC)

	const isCanceling = cancelApplicationMutation.isPending

	return (
		<>
			<TableRow
				className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
				data-cy="application-row"
			>
				<StatusCell application={application} />
				<TitleCell application={application} onRowClick={handleRowClick} />
				<DateCell
					date={application.createdAt}
					icon={Clock}
					testId="application-created-at"
				/>
				<DateCell
					date={application.volunteerActivity.startAt}
					icon={Calendar}
					testId="application-activity-date"
				/>
				<LocationCell location={application.volunteerActivity.location} />
				<ActionCell
					canCancel={canCancel}
					isCanceling={isCanceling}
					onCancelClick={handleCancelClick}
				/>
			</TableRow>
			<CancelDialog
				isOpen={isDeleteDialogOpen}
				isPending={cancelApplicationMutation.isPending}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={handleCancel}
			/>
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
				<Table data-cy="my-applications-table">
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
									<div
										className="flex flex-col items-center"
										data-cy="empty-applications"
									>
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
