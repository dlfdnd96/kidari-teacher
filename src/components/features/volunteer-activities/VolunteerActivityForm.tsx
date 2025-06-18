'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
	CalendarIcon,
	FileText,
	MapPin,
	Users,
	Clock,
	Settings,
} from 'lucide-react'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { ZodError } from 'zod/v4'
import { CreateVolunteerActivityInputSchema } from '@/shared/schemas/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityFormProps,
} from '@/types/volunteer-activity'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { Enum, ZodEnum } from '@/enums'
import { trpc } from '@/components/providers/TrpcProvider'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const VolunteerActivityForm = memo(
	({ onClose }: VolunteerActivityFormProps) => {
		const { register, handleSubmit, watch, setValue, formState } = useForm()
		const { data: session } = useSession()
		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()
		const createVolunteerActivityMutation =
			trpc.volunteerActivity.createVolunteerActivity.useMutation({
				onSuccess: async () => {
					await utils.volunteerActivity.getVolunteerActivityList.invalidate()
					router.refresh()
					onClose()
				},
				onError: (error) => {
					showError(error.message, '봉사활동 등록 오류')
				},
			})

		const onSubmit = useCallback(
			async (data: unknown) => {
				if (!session?.user) {
					showError('로그인이 필요합니다.', '인증 오류')
					return
				}

				try {
					const validateData = CreateVolunteerActivityInputSchema.parse(data)
					await createVolunteerActivityMutation.mutateAsync(validateData)
				} catch (error) {
					if (error instanceof ZodError) {
						showError(error.message, '입력 검증 오류')
					} else {
						console.error('Create error:', error)

						const errorMessage =
							error instanceof Error
								? error.message
								: '알 수 없는 오류가 발생했습니다.'
						showError(errorMessage, '봉사활동 등록 오류')
					}
				}
			},
			[createVolunteerActivityMutation, session, showError],
		)

		const loading = createVolunteerActivityMutation.isPending

		return (
			<>
				<div className="bg-transparent">
					{/* 폼 */}
					<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
						<div className="space-y-6">
							{/* 활동명 */}
							<div>
								<label
									htmlFor="activity-title"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<FileText className="w-4 h-4 mr-2" />
									<span>활동명 *</span>
								</label>
								<Input
									id="activity-title"
									{...register('title', { required: true })}
									placeholder="봉사활동 제목을 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
								/>
							</div>

							{/* 활동 설명 */}
							<div>
								<label
									htmlFor="activity-description"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<FileText className="w-4 h-4 mr-2" />
									<span>활동 설명 *</span>
								</label>
								<Textarea
									id="activity-description"
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
									htmlFor="activity-location"
									className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
								>
									<MapPin className="w-4 h-4 mr-2" />
									<span>활동 장소 *</span>
								</label>
								<Input
									id="activity-location"
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
									value={
										watch('status') || Enum.VolunteerActivityStatus.PLANNING
									}
								/>
								<Select
									value={
										watch('status') || Enum.VolunteerActivityStatus.PLANNING
									}
									disabled={loading}
									onValueChange={(value) => setValue('status', value)}
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
													format(watch('applicationDeadline'), 'yyyy년 M월 d일')
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
										htmlFor="max-participants"
										className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
									>
										<Users className="w-4 h-4 mr-2" />
										<span>최대 참가자 수</span>
									</label>
									<Input
										id="max-participants"
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
							<div className="flex justify-end gap-3 pt-4">
								<Button
									type="submit"
									disabled={loading || formState.isSubmitting}
									className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
								>
									{loading ? (
										<>
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
											<span>저장 중...</span>
										</>
									) : (
										<span>생성하기</span>
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</>
		)
	},
)

VolunteerActivityForm.displayName = 'VolunteerActivityForm'

export default VolunteerActivityForm
