'use client'

import React, { memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Script from 'next/script'
import {
	CalendarIcon,
	Clock,
	FileText,
	MapPin,
	Settings,
	Users,
} from 'lucide-react'
import { format, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	ERROR_MESSAGES,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { CreateVolunteerActivityInputSchema } from '@/shared/schemas/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityFormProps,
} from '@/types/volunteer-activity'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import {
	CalendarCustom,
	FieldError,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'
import { Enum } from '@/enums'
import { trpc } from '@/components/providers/TrpcProvider'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/contexts/ToastContext'
import { validators } from '@/utils/validation'
import { useFieldValidation } from '@/hooks/useFieldValidation'

const VolunteerActivityForm = memo(
	({ onClose }: VolunteerActivityFormProps) => {
		const { register, handleSubmit, watch, setValue, formState } = useForm()
		const { data: session } = useSession()
		const router = useRouter()
		const { showError } = useErrorModal()
		const { showError: showErrorToast } = useToast()

		const utils = trpc.useUtils()

		const validation = useFieldValidation()
		const { errors, clearError, validateAll } = validation

		const titleValue = watch('title')
		const descriptionValue = watch('description')
		const startAtValue = watch('startAt')
		const endAtValue = watch('endAt')
		const locationValue = watch('location')
		const applicationDeadlineValue = watch('applicationDeadline')

		useEffect(() => {
			if (titleValue && titleValue.trim()) {
				clearError('title')
			}
			if (descriptionValue && descriptionValue.trim()) {
				clearError('description')
			}
			if (locationValue && locationValue.trim()) {
				clearError('location')
			}
			if (startAtValue) {
				clearError('startAt')
			}
			if (endAtValue) {
				clearError('endAt')
			}
			if (applicationDeadlineValue) {
				clearError('applicationDeadline')
			}
		}, [
			applicationDeadlineValue,
			clearError,
			descriptionValue,
			endAtValue,
			locationValue,
			startAtValue,
			titleValue,
		])

		const createVolunteerActivityMutation =
			trpc.volunteerActivity.createVolunteerActivity.useMutation({
				onSuccess: async () => {
					await utils.volunteerActivity.getVolunteerActivityList.invalidate()
					router.refresh()
					onClose()
				},
				onError: (error) => {
					handleClientError(error, showError, '봉사활동 등록 오류')
				},
			})

		const handleAddressSearch = useCallback(() => {
			if (!window.daum) {
				showErrorToast(
					'검색 서비스 불러오기 오류',
					'주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
					{
						position: 'top-center',
					},
				)
				return
			}

			new window.daum.Postcode({
				oncomplete: function (data) {
					setValue('location', data.roadAddress || data.jibunAddress)
					clearError('location')
				},
			}).open()
		}, [setValue, showErrorToast, clearError])

		const onSubmit = useCallback(
			async (data: Record<string, unknown>) => {
				if (!session?.user) {
					handleClientError(
						ERROR_MESSAGES.AUTHENTICATION_ERROR,
						showError,
						'인증 오류',
					)
					return
				}

				const validationRules = {
					title: validators.required('제목을 입력해주세요'),
					description: validators.required('활동 내용을 입력해주세요'),
					startAt: validators.required('시작 날짜를 입력해주세요'),
					endAt: validators.required('종료 날짜를 입력해주세요'),
					location: validators.required('장소를 입력해주세요'),
					applicationDeadline: validators.required('마감일자를 입력해주세요'),
				}

				const hasErrors = validateAll(data, validationRules)
				if (hasErrors) {
					return
				}

				try {
					const validateData = CreateVolunteerActivityInputSchema.parse(data)
					await createVolunteerActivityMutation.mutateAsync(validateData)
				} catch (error) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(error, showError, '봉사활동 등록 오류')
					}
				}
			},
			[createVolunteerActivityMutation, session, validateAll, showError],
		)

		const loading = createVolunteerActivityMutation.isPending

		return (
			<>
				{/* Daum 우편번호 API 스크립트 로드 */}
				<Script
					src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
					strategy="lazyOnload"
				/>

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
									{...register('title')}
									placeholder="봉사활동 제목을 입력하세요"
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
								/>
								<FieldError error={errors.title} />
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
									{...register('description')}
									placeholder="봉사활동에 대한 상세한 설명을 입력하세요"
									rows={6}
									disabled={loading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
								/>
								<FieldError error={errors.description} />
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
													!startAtValue && 'text-muted-foreground',
												)}
											>
												{startAtValue ? (
													format(startAtValue, 'yyyy년 M월 d일 HH:mm', {
														locale: ko,
													})
												) : (
													<span>시작 일시 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<CalendarCustom
												mode="single"
												selected={startAtValue}
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
												captionLayout="dropdown-months"
												startMonth={new Date()}
												locale={ko}
											/>
											<div className="p-3 border-t">
												<Input
													type="time"
													value={
														startAtValue ? format(startAtValue, 'HH:mm') : ''
													}
													onChange={(e) => {
														const currentDate =
															startAtValue ||
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
									<FieldError error={errors.startAt} />
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
													!endAtValue && 'text-muted-foreground',
												)}
											>
												{endAtValue ? (
													format(endAtValue, 'yyyy년 M월 d일 HH:mm', {
														locale: ko,
													})
												) : (
													<span>종료 일시 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<CalendarCustom
												mode="single"
												selected={endAtValue}
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
												captionLayout="dropdown-months"
												startMonth={new Date()}
												locale={ko}
											/>
											<div className="p-3 border-t">
												<Input
													type="time"
													value={endAtValue ? format(endAtValue, 'HH:mm') : ''}
													onChange={(e) => {
														const currentDate =
															endAtValue ||
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
									<FieldError error={errors.endAt} />
								</div>
							</div>

							{/* 활동 장소 */}
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
									{...register('location')}
									placeholder="클릭하여 주소를 검색하세요"
									disabled={loading}
									readOnly
									onClick={handleAddressSearch}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50"
								/>
								<FieldError error={errors.location} />
							</div>

							{/* 상태 */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
									<Settings className="w-4 h-4 mr-2" />
									<span>상태 *</span>
								</label>
								<input
									{...register('status')}
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
								<FieldError error={errors.status} />
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
													!applicationDeadlineValue && 'text-muted-foreground',
												)}
											>
												{applicationDeadlineValue ? (
													format(applicationDeadlineValue, 'yyyy년 M월 d일')
												) : (
													<span>마감일 선택</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<CalendarCustom
												mode="single"
												selected={applicationDeadlineValue}
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
												captionLayout="dropdown-months"
												startMonth={new Date()}
												locale={ko}
											/>
										</PopoverContent>
									</Popover>
									<FieldError error={errors.applicationDeadline} />
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
									className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
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
