'use client'

import React, { memo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import Script from 'next/script'
import {
	ArrowLeft,
	CalendarIcon,
	Clock,
	FileText,
	MapPin,
	Settings,
	Users,
	X,
	Send,
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
	CLIENT_ERROR_KEY_MAPPING,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import { CreateVolunteerActivityInputSchema } from '@/shared/schemas/volunteer-activity'
import { VOLUNTEER_ACTIVITY_STATUS_LABELS } from '@/types/volunteer-activity'
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
import { useToast } from '@/contexts/ToastContext'
import { validators } from '@/utils/validation'
import { useFieldValidation } from '@/hooks/useFieldValidation'

const VolunteerActivityCreatePageClient = memo(() => {
	const { register, handleSubmit, watch, setValue } = useForm()
	const { data: session } = useSession()
	const router = useRouter()
	const { showError } = useErrorModal()
	const { showError: showErrorToast, showSuccess } = useToast()

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
				showSuccess('봉사활동이 성공적으로 생성되었습니다!')
				router.push('/volunteer-activities')
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

	const handleGoBack = useCallback(() => {
		if (typeof window !== 'undefined') {
			try {
				const savedFilters = sessionStorage.getItem(
					'volunteer-activities-filters',
				)
				if (savedFilters) {
					const filters = JSON.parse(savedFilters)
					const urlParams = new URLSearchParams()

					if (filters.status) {
						urlParams.set('status', filters.status)
					}
					if (filters.search) {
						urlParams.set('search', filters.search)
					}
					if (filters.page) {
						urlParams.set('page', filters.page.toString())
					}

					const queryString = urlParams.toString()
					const targetUrl = queryString
						? `/volunteer-activities?${queryString}`
						: '/volunteer-activities'

					sessionStorage.removeItem('volunteer-activities-filters')

					router.push(targetUrl)
					return
				}
			} catch (error) {
				console.warn('필터 상태 복원 중 오류:', error)
			}
		}

		router.push('/volunteer-activities')
	}, [router])

	const loading = createVolunteerActivityMutation.isPending

	return (
		<>
			{/* Daum 우편번호 API 스크립트 로드 */}
			<Script
				src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
				strategy="lazyOnload"
			/>

			<div className="min-h-screen">
				{/* 상단 네비게이션 */}
				<div className="pt-4">
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
						<div className="flex items-center h-14">
							<div className="py-4">
								<Button
									onClick={handleGoBack}
									variant="outline"
									className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer border-0 h-auto"
								>
									<ArrowLeft className="w-4 h-4" />
									<span className="text-sm font-medium">뒤로가기</span>
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* 메인 컨텐츠 */}
				<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
					<div className="p-6 sm:p-8">
						{/* 헤더 */}
						<div className="mb-8">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 min-w-0">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
										새 봉사활동 생성
									</h1>
								</div>
							</div>
							<div className="border-b border-gray-200 dark:border-gray-700"></div>
						</div>

						{/* 폼 */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
							{/* 기본 정보 섹션 */}
							<div className="space-y-6">
								{/* 활동명 */}
								<div className="flex items-start gap-3">
									<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<label
											htmlFor="activity-title"
											className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
										>
											활동명 *
										</label>
										<Input
											id="activity-title"
											{...register('title')}
											placeholder="봉사활동명을 입력해주세요"
											className="w-full h-12"
											disabled={loading}
											data-cy="create-volunteer-activity-title-input"
										/>
										<FieldError error={errors.title} />
									</div>
								</div>

								{/* 활동 내용 */}
								<div className="flex items-start gap-3">
									<FileText className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<label
											htmlFor="activity-description"
											className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
										>
											활동 내용 *
										</label>
										<Textarea
											id="activity-description"
											{...register('description')}
											placeholder="봉사활동에 대한 자세한 설명을 입력해주세요"
											rows={6}
											className="w-full resize-none"
											disabled={loading}
											data-cy="create-volunteer-activity-content-input"
										/>
										<FieldError error={errors.description} />
									</div>
								</div>

								{/* 활동 장소 */}
								<div className="flex items-start gap-3">
									<MapPin className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
									<div className="flex-1">
										<label
											htmlFor="activity-location"
											className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
										>
											활동 장소 *
										</label>
										<Input
											id="activity-location"
											{...register('location')}
											placeholder="클릭하여 주소를 검색하세요"
											disabled={loading}
											readOnly
											onClick={handleAddressSearch}
											className="w-full h-12 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50"
											data-cy="create-volunteer-activity-location-input"
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
														data-cy="create-volunteer-activity-start-date-time-popover"
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
															startOfDay(
																new TZDate(new Date(), TIME_ZONE.SEOUL),
															)
														}
														captionLayout="dropdown-months"
														startMonth={new Date()}
														locale={ko}
													/>
													<div className="p-3 border-t">
														<Input
															type="time"
															value={
																startAtValue
																	? format(startAtValue, 'HH:mm')
																	: ''
															}
															onChange={(e) => {
																const currentDate =
																	startAtValue ||
																	new TZDate(new Date(), TIME_ZONE.SEOUL)
																if (e.target.value) {
																	const [hours, minutes] =
																		e.target.value.split(':')
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
															data-cy="create-volunteer-activity-start-date-time-input"
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
														data-cy="create-volunteer-activity-end-date-time-popover"
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
															startOfDay(
																new TZDate(new Date(), TIME_ZONE.SEOUL),
															)
														}
														captionLayout="dropdown-months"
														startMonth={new Date()}
														locale={ko}
													/>
													<div className="p-3 border-t">
														<Input
															type="time"
															value={
																endAtValue ? format(endAtValue, 'HH:mm') : ''
															}
															onChange={(e) => {
																const currentDate =
																	endAtValue ||
																	new TZDate(new Date(), TIME_ZONE.SEOUL)
																if (e.target.value) {
																	const [hours, minutes] =
																		e.target.value.split(':')
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
															data-cy="create-volunteer-activity-end-date-time-input"
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
														!applicationDeadlineValue &&
															'text-muted-foreground',
													)}
													disabled={loading}
													data-cy="create-volunteer-activity-application-deadline-popover"
												>
													{applicationDeadlineValue ? (
														format(applicationDeadlineValue, 'yyyy년 M월 d일', {
															locale: ko,
														})
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
												htmlFor="max-participants"
												className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
											>
												최대 모집 인원
											</label>
											<Input
												id="max-participants"
												type="number"
												{...register('maxParticipants')}
												placeholder="최대 모집 인원을 입력해주세요."
												className="w-full h-12"
												disabled={loading}
												data-cy="create-volunteer-activity-recruitment-count-input"
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
											<input
												{...register('status')}
												type="hidden"
												value={
													watch('status') ||
													Enum.VolunteerActivityStatus.PLANNING
												}
											/>
											<Select
												value={
													watch('status') ||
													Enum.VolunteerActivityStatus.PLANNING
												}
												disabled={loading}
												onValueChange={(value) => setValue('status', value)}
											>
												<SelectTrigger className="w-full h-12">
													<SelectValue placeholder="상태를 선택해주세요" />
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
									</div>
								</div>
							</div>

							{/* 제출 버튼 영역 */}
							<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
								<div className="flex justify-center gap-4">
									<Button
										type="submit"
										disabled={loading}
										variant="outline"
										className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
										data-cy="create-volunteer-activity-button"
									>
										{loading ? (
											<>
												<div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
												<span>생성 중...</span>
											</>
										) : (
											<>
												<Send className="w-4 h-4" />
												<span>봉사활동 생성</span>
											</>
										)}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={handleGoBack}
										className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto"
										disabled={loading}
										data-cy="create-cancel-button"
									>
										<X className="w-4 h-4" />
										<span>취소</span>
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
})

VolunteerActivityCreatePageClient.displayName =
	'VolunteerActivityCreatePageClient'

export default VolunteerActivityCreatePageClient
