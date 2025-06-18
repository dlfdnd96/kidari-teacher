'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import { ZodError } from 'zod/v4'
import { VolunteerActivityEditFormSchema } from '@/shared/schemas/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityEditFormProps,
} from '@/types/volunteer-activity'
import {
	FileText,
	PenLine,
	Save,
	X,
	MapPin,
	Users,
	Clock,
	CalendarIcon,
	Settings,
} from 'lucide-react'
import {
	Calendar,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { ZodEnum } from '@/enums'

const VolunteerActivityEditForm = memo(
	({
		id,
		initialTitle,
		initialDescription,
		initialStartAt,
		initialEndAt,
		initialLocation,
		initialStatus,
		initialApplicationDeadline,
		initialMaxParticipants,
		onCancel,
	}: VolunteerActivityEditFormProps) => {
		const { register, handleSubmit, watch, setValue, formState } = useForm({
			defaultValues: {
				title: initialTitle,
				description: initialDescription,
				startAt: initialStartAt,
				endAt: initialEndAt,
				location: initialLocation,
				status: initialStatus,
				applicationDeadline: initialApplicationDeadline,
				maxParticipants: initialMaxParticipants,
			},
		})

		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()
		const updateVolunteerActivityMutation =
			trpc.volunteerActivity.updateVolunteerActivity.useMutation({
				onSuccess: async () => {
					await utils.volunteerActivity.getVolunteerActivityList.invalidate()
					router.refresh()
					onCancel()
				},
				onError: (error) => {
					showError(error.message, '봉사활동 수정 오류')
				},
			})

		const onSubmit = useCallback(
			async (data: unknown) => {
				try {
					const validatedData = VolunteerActivityEditFormSchema.parse(data)
					await updateVolunteerActivityMutation.mutateAsync({
						id,
						...validatedData,
					})
				} catch (error: unknown) {
					if (error instanceof ZodError) {
						showError(error.message, '입력 검증 오류')
					} else {
						console.error('Update error:', error)

						const errorMessage =
							error instanceof Error
								? error.message
								: '알 수 없는 오류가 발생했습니다.'
						showError(errorMessage, '봉사활동 수정 오류')
					}
				}
			},
			[id, updateVolunteerActivityMutation, showError],
		)

		const loading = updateVolunteerActivityMutation.isPending

		return (
			<>
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-4 sm:mb-6">
					{/* 헤더 */}
					<div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8">
						<div className="flex items-center">
							<PenLine className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									봉사활동 수정
								</h2>
							</div>
						</div>
					</div>

					{/* 폼 */}
					<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
						<div className="space-y-6">
							{/* 활동명 */}
							<div>
								<label
									htmlFor="edit-title"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<FileText className="w-4 h-4 mr-2" />
									<span>활동명</span>
								</label>
								<Input
									id="edit-title"
									{...register('title', { required: true })}
									placeholder="봉사활동 제목을 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
								/>
							</div>

							{/* 활동 설명 */}
							<div>
								<label
									htmlFor="edit-description"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<FileText className="w-4 h-4 mr-2" />
									<span>활동 설명</span>
								</label>
								<Textarea
									id="edit-description"
									{...register('description', { required: true })}
									placeholder="봉사활동에 대한 상세한 설명을 입력하세요"
									rows={6}
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
								/>
							</div>

							{/* 일시 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* 시작 일시 */}
								<div>
									<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
										<Clock className="w-4 h-4 mr-2" />
										<span>시작 일시 *</span>
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-3 text-left font-normal bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12',
													!watch('startAt') && 'text-muted-foreground',
												)}
											>
												{watch('startAt') ? (
													format(watch('startAt'), 'yyyy년 M월 d일 HH:mm', {
														locale: ko,
													})
												) : (
													<span>시작 일시 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={watch('startAt')}
												onSelect={(date) =>
													setValue(
														'startAt',
														date || new TZDate(new Date(), TIME_ZONE.SEOUL),
													)
												}
												disabled={(date) =>
													startOfDay(date) <
													startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL))
												}
											/>
											<div className="p-3 border-t">
												<Input
													type="time"
													value={
														watch('startAt')
															? format(watch('startAt'), 'HH:mm')
															: ''
													}
													onChange={(e) => {
														const currentDate =
															watch('startAt') ||
															new TZDate(new Date(), TIME_ZONE.SEOUL)
														if (e.target.value) {
															const [hours, minutes] = e.target.value.split(':')
															const newDate = new TZDate(
																currentDate,
																TIME_ZONE.SEOUL,
															)
															newDate.setHours(
																parseInt(hours),
																parseInt(minutes),
															)
															setValue('startAt', newDate)
														}
													}}
												/>
											</div>
										</PopoverContent>
									</Popover>
								</div>

								{/* 종료 일시 */}
								<div>
									<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
										<Clock className="w-4 h-4 mr-2" />
										<span>종료 일시 *</span>
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-3 text-left font-normal bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12',
													!watch('endAt') && 'text-muted-foreground',
												)}
											>
												{watch('endAt') ? (
													format(watch('endAt'), 'yyyy년 M월 d일 HH:mm', {
														locale: ko,
													})
												) : (
													<span>종료 일시 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={watch('endAt')}
												onSelect={(date) =>
													setValue(
														'endAt',
														date || new TZDate(new Date(), TIME_ZONE.SEOUL),
													)
												}
												disabled={(date) =>
													startOfDay(date) <
													startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL))
												}
											/>
											<div className="p-3 border-t">
												<Input
													type="time"
													value={
														watch('endAt')
															? format(watch('endAt'), 'HH:mm')
															: ''
													}
													onChange={(e) => {
														const currentDate =
															watch('endAt') ||
															new TZDate(new Date(), TIME_ZONE.SEOUL)
														if (e.target.value) {
															const [hours, minutes] = e.target.value.split(':')
															const newDate = new TZDate(
																currentDate,
																TIME_ZONE.SEOUL,
															)
															newDate.setHours(
																parseInt(hours),
																parseInt(minutes),
															)
															setValue('endAt', newDate)
														}
													}}
												/>
											</div>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							{/* 장소 */}
							<div>
								<label
									htmlFor="edit-location"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<MapPin className="w-4 h-4 mr-2" />
									<span>활동 장소</span>
								</label>
								<Input
									id="edit-location"
									{...register('location', { required: true })}
									placeholder="봉사활동이 진행될 장소를 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
								/>
							</div>

							{/* 상태 */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
									<Settings className="w-4 h-4 mr-2" />
									<span>상태 *</span>
								</label>
								<input
									{...register('status', { required: true })}
									type="hidden"
									value={watch('status')}
								/>
								<Select
									value={watch('status')}
									defaultValue={initialStatus}
									disabled={loading}
									onValueChange={(value) =>
										setValue(
											'status',
											ZodEnum.VolunteerActivityStatus.parse(value),
										)
									}
								>
									<SelectTrigger className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200">
										<SelectValue placeholder="상태를 선택하세요" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(VOLUNTEER_ACTIVITY_STATUS_LABELS).map(
											([value, label]) => (
												<SelectItem key={value} value={value}>
													{label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>

							{/* 신청 마감일과 최대 참가자 수 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* 신청 마감일 */}
								<div>
									<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
										<CalendarIcon className="w-4 h-4 mr-2" />
										<span>신청 마감일 *</span>
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-3 text-left font-normal bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12',
													!watch('applicationDeadline') &&
														'text-muted-foreground',
												)}
											>
												{watch('applicationDeadline') ? (
													format(
														watch('applicationDeadline'),
														'yyyy년 M월 d일',
														{
															locale: ko,
														},
													)
												) : (
													<span>마감일 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={watch('applicationDeadline')}
												onSelect={(date) => {
													const newDate = new TZDate(
														date || new Date(),
														TIME_ZONE.SEOUL,
													)
													newDate.setHours(23, 59, 59, 999)
													setValue('applicationDeadline', newDate)
												}}
												disabled={(date) =>
													startOfDay(date) <
													startOfDay(new TZDate(new Date(), TIME_ZONE.SEOUL))
												}
											/>
										</PopoverContent>
									</Popover>
								</div>

								{/* 최대 참가자 수 */}
								<div>
									<label
										htmlFor="edit-max-participants"
										className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
									>
										<Users className="w-4 h-4 mr-2" />
										<span>최대 참가자 수</span>
									</label>
									<Input
										id="edit-max-participants"
										type="number"
										{...register('maxParticipants', {
											setValueAs: (value) =>
												value === '' ? undefined : parseInt(value),
										})}
										placeholder="제한 없음"
										disabled={loading}
										className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
									/>
									<p className="text-xs text-gray-500 mt-1">
										비워두면 인원 제한이 없습니다.
									</p>
								</div>
							</div>

							{/* 버튼들 */}
							<div className="flex flex-col sm:flex-row gap-3 pt-6">
								<Button
									type="submit"
									disabled={loading || formState.isSubmitting}
									className="flex-1 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
								>
									{loading ? (
										<>
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
											<span>수정 중...</span>
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-1.5" />
											<span>수정</span>
										</>
									)}
								</Button>

								<Button
									type="button"
									onClick={onCancel}
									disabled={loading}
									variant="outline"
									className="flex-1 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
								>
									<X className="w-4 h-4 mr-1.5" />
									<span>취소</span>
								</Button>
							</div>
						</div>
					</form>
				</div>
			</>
		)
	},
)

VolunteerActivityEditForm.displayName = 'VolunteerActivityEditForm'

export default VolunteerActivityEditForm
