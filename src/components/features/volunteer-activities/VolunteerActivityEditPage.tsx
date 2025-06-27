'use client'

import React, { memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import { trpc } from '@/components/providers/TrpcProvider'
import {
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { VolunteerActivityEditFormSchema } from '@/shared/schemas/volunteer-activity'
import {
	VOLUNTEER_ACTIVITY_STATUS_LABELS,
	VolunteerActivityEditFormProps,
} from '@/types/volunteer-activity'
import {
	CalendarIcon,
	Clock,
	FileText,
	MapPin,
	Settings,
	Users,
} from 'lucide-react'
import {
	CalendarCustom,
	FieldError,
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
import { useSession } from 'next-auth/react'
import Script from 'next/script'
import { useToast } from '@/contexts/ToastContext'
import { validators } from '@/utils/validation'
import { useFieldValidation } from '@/hooks/useFieldValidation'

const VolunteerActivityEditPage = memo(
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
		const { register, handleSubmit, watch, setValue } = useForm({
			defaultValues: {
				title: initialTitle,
				description: initialDescription,
				startAt: initialStartAt,
				endAt: initialEndAt,
				location: initialLocation,
				status: initialStatus,
				applicationDeadline: initialApplicationDeadline,
				maxParticipants: initialMaxParticipants ?? '',
			},
		})

		const router = useRouter()
		const { data: session } = useSession()
		const { showError } = useErrorModal()
		const { showError: showErrorToast } = useToast()

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

		const utils = trpc.useUtils()
		const updateVolunteerActivityMutation =
			trpc.volunteerActivity.updateVolunteerActivity.useMutation({
				onSuccess: async () => {
					await Promise.all([
						utils.volunteerActivity.getVolunteerActivityList.invalidate(),
						utils.volunteerActivity.getVolunteerActivity.invalidate({ id }),
					])
					router.push(`/volunteer-activities/${id}`)
				},
				onError: (error) => {
					handleClientError(error, showError, '봉사활동 수정 오류')
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
						CLIENT_ERROR_KEY_MAPPING.AUTHENTICATION_ERROR,
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
					const validatedData = VolunteerActivityEditFormSchema.parse(data)
					await updateVolunteerActivityMutation.mutateAsync({
						id,
						...validatedData,
					})
				} catch (error: unknown) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(error, showError, '봉사활동 수정 오류')
					}
				}
			},
			[session, showError, validateAll, updateVolunteerActivityMutation, id],
		)

		const loading = updateVolunteerActivityMutation.isPending

		return (
			<>
				{/* Daum 우편번호 API 스크립트 로드 */}
				<Script
					src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
					strategy="lazyOnload"
				/>

				{/* 폼 */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* 기본 정보 섹션 */}
					<div className="space-y-6">
						{/* 활동명 */}
						<div className="flex items-start gap-3">
							<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
							<div className="flex-1">
								<label
									htmlFor="edit-title"
									className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
								>
									활동명 *
								</label>
								<Input
									id="edit-title"
									{...register('title')}
									placeholder="봉사활동명을 입력해주세요"
									className="w-full h-12"
									disabled={loading}
								/>
								<FieldError error={errors.title} />
							</div>
						</div>

						{/* 활동 내용 */}
						<div className="flex items-start gap-3">
							<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
							<div className="flex-1">
								<label
									htmlFor="edit-description"
									className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
								>
									활동 내용 *
								</label>
								<Textarea
									id="edit-description"
									{...register('description')}
									placeholder="봉사활동에 대한 자세한 설명을 입력해주세요"
									rows={6}
									className="w-full resize-none"
									disabled={loading}
								/>
								<FieldError error={errors.description} />
							</div>
						</div>

						{/* 활동 장소 */}
						<div className="flex items-start gap-3">
							<MapPin className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
							<div className="flex-1">
								<label
									htmlFor="edit-location"
									className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
								>
									활동 장소 *
								</label>
								<Input
									id="edit-location"
									{...register('location')}
									placeholder="클릭하여 주소를 검색하세요"
									disabled={loading}
									readOnly
									onClick={handleAddressSearch}
									className="w-full h-12 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50"
								/>
								<FieldError error={errors.location} />
							</div>
						</div>
					</div>

					{/* 구분선 */}
					<div className="border-t border-gray-200 dark:border-gray-700"></div>

					{/* 일정 정보 섹션 */}
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							일정 정보
						</h3>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* 시작 일시 */}
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
										시작 일시 *
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-4 text-left font-normal h-12',
													!startAtValue && 'text-muted-foreground',
												)}
												disabled={loading}
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
							</div>

							{/* 종료 일시 */}
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
										종료 일시 *
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-4 text-left font-normal h-12',
													!endAtValue && 'text-muted-foreground',
												)}
												disabled={loading}
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
						</div>

						{/* 신청 마감일 */}
						<div className="flex items-start gap-3">
							<Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
							<div className="flex-1">
								<label className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
									신청 마감일 *
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												'w-full pl-4 text-left font-normal h-12',
												!applicationDeadlineValue && 'text-muted-foreground',
											)}
											disabled={loading}
										>
											{applicationDeadlineValue ? (
												format(
													applicationDeadlineValue,
													'yyyy년 M월 d일 HH:mm',
													{
														locale: ko,
													},
												)
											) : (
												<span>신청 마감일 선택</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<CalendarCustom
											mode="single"
											selected={applicationDeadlineValue}
											onSelect={(date) =>
												setValue(
													'applicationDeadline',
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
													applicationDeadlineValue
														? format(applicationDeadlineValue, 'HH:mm')
														: ''
												}
												onChange={(e) => {
													const currentDate =
														applicationDeadlineValue ||
														new TZDate(new Date(), TIME_ZONE.SEOUL)
													if (e.target.value) {
														const [hours, minutes] = e.target.value.split(':')
														const newDate = new TZDate(
															currentDate,
															TIME_ZONE.SEOUL,
														)
														newDate.setHours(parseInt(hours), parseInt(minutes))
														setValue('applicationDeadline', newDate)
													}
												}}
											/>
										</div>
									</PopoverContent>
								</Popover>
								<FieldError error={errors.applicationDeadline} />
							</div>
						</div>
					</div>

					{/* 구분선 */}
					<div className="border-t border-gray-200 dark:border-gray-700"></div>

					{/* 추가 설정 섹션 */}
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							추가 설정
						</h3>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* 모집 인원 */}
							<div className="flex items-start gap-3">
								<Users className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label
										htmlFor="edit-max-participants"
										className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
									>
										최대 모집 인원
									</label>
									<Input
										id="edit-max-participants"
										type="number"
										{...register('maxParticipants')}
										placeholder="최대 모집 인원을 입력해주세요"
										className="w-full h-12"
										disabled={loading}
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										비워두면 인원 제한이 없습니다
									</p>
								</div>
							</div>

							{/* 상태 */}
							<div className="flex items-start gap-3">
								<Settings className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
								<div className="flex-1">
									<label className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
										상태
									</label>
									<Select
										value={watch('status')}
										onValueChange={(value) =>
											setValue(
												'status',
												ZodEnum.VolunteerActivityStatus.parse(value),
											)
										}
									>
										<SelectTrigger className="w-full h-12">
											<SelectValue placeholder="상태를 선택해주세요" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(VOLUNTEER_ACTIVITY_STATUS_LABELS).map(
												([key, label]) => (
													<SelectItem key={key} value={key}>
														{label}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
									<FieldError error={errors.status} />
								</div>
							</div>
						</div>
					</div>

					{/* 제출 버튼 영역 */}
					<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
						<div className="flex justify-center gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								className="px-8 py-3 h-12 cursor-pointer"
								disabled={loading}
							>
								취소
							</Button>
							<Button
								type="submit"
								disabled={loading}
								className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0"
							>
								{loading ? '수정 중...' : '수정 완료'}
							</Button>
						</div>
					</div>
				</form>
			</>
		)
	},
)

VolunteerActivityEditPage.displayName = 'VolunteerActivityEditPage'

export default VolunteerActivityEditPage
