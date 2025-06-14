'use client'

import React, { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CalendarIcon,
	FileText,
	MapPin,
	Users,
	Clock,
	Package,
	AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
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
import { trpc } from '@/components/providers/TrpcProvider'
import { useRouter } from 'next/navigation'
import { ZodError } from 'zod/v4'
import { CreateVolunteerActivityInputSchema } from '@/shared/schemas/volunteer-activity'
import type { VolunteerActivityFormProps } from '@/types/volunteer-activity'

const VolunteerActivityForm = memo(
	({
		activity,
		onSubmit,
		onCancel,
		isLoading = false,
		isModal = false,
	}: VolunteerActivityFormProps) => {
		const isEditing = !!activity
		const { showError } = useErrorModal()
		const router = useRouter()

		const { register, handleSubmit, control, watch, setValue, formState } =
			useForm({
				resolver: zodResolver(CreateVolunteerActivityInputSchema),
				defaultValues: {
					title: activity?.title || '',
					description: activity?.description || '',
					startAt: activity?.startAt ? new Date(activity.startAt) : new Date(),
					endAt: activity?.endAt ? new Date(activity.endAt) : new Date(),
					location: activity?.location || '',
					applicationDeadline: activity?.applicationDeadline
						? new Date(activity.applicationDeadline)
						: new Date(),
					maxParticipants: activity?.maxParticipants || undefined,
					qualifications: activity?.qualifications || '',
					materials: activity?.materials || '',
				},
			})

		const handleFormSubmit = useCallback(
			async (data: unknown) => {
				try {
					const validatedData = CreateVolunteerActivityInputSchema.parse(data)
					onSubmit(validatedData)
				} catch (error: unknown) {
					if (error instanceof ZodError) {
						showError(error.message, '입력 검증 오류')
					} else {
						console.error('Form error:', error)
						const errorMessage =
							error instanceof Error
								? error.message
								: '알 수 없는 오류가 발생했습니다.'
						showError(errorMessage, '봉사활동 저장 오류')
					}
				}
			},
			[onSubmit, showError],
		)

		return (
			<div
				className={`${
					isModal
						? 'bg-transparent'
						: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12'
				}`}
			>
				{/* 헤더 - 모달이 아닐 때만 표시 */}
				{!isModal && (
					<div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8">
						<div className="flex items-center">
							<FileText className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									{isEditing ? '봉사활동 수정' : '새 봉사활동 생성'}
								</h2>
							</div>
						</div>
					</div>
				)}

				{/* 폼 */}
				<form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 sm:p-8">
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
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
							{formState.errors.title && (
								<p className="text-red-500 text-sm mt-1">
									{formState.errors.title.message}
								</p>
							)}
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
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
							/>
							{formState.errors.description && (
								<p className="text-red-500 text-sm mt-1">
									{formState.errors.description.message}
								</p>
							)}
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
												setValue('startAt', date || new Date())
											}
											disabled={(date) => date < new Date()}
											initialFocus
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
													const currentDate = watch('startAt') || new Date()
													if (e.target.value) {
														const [hours, minutes] = e.target.value.split(':')
														const newDate = new Date(currentDate)
														newDate.setHours(parseInt(hours), parseInt(minutes))
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
											onSelect={(date) => setValue('endAt', date || new Date())}
											disabled={(date) => date < new Date()}
											initialFocus
										/>
										<div className="p-3 border-t">
											<Input
												type="time"
												value={
													watch('endAt') ? format(watch('endAt'), 'HH:mm') : ''
												}
												onChange={(e) => {
													const currentDate = watch('endAt') || new Date()
													if (e.target.value) {
														const [hours, minutes] = e.target.value.split(':')
														const newDate = new Date(currentDate)
														newDate.setHours(parseInt(hours), parseInt(minutes))
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
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
							{formState.errors.location && (
								<p className="text-red-500 text-sm mt-1">
									{formState.errors.location.message}
								</p>
							)}
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
												format(watch('applicationDeadline'), 'yyyy년 M월 d일', {
													locale: ko,
												})
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
											onSelect={(date) =>
												setValue('applicationDeadline', date || new Date())
											}
											disabled={(date) => date < new Date()}
											initialFocus
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
									disabled={isLoading}
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
								/>
								<p className="text-xs text-gray-500 mt-1">
									비워두면 인원 제한이 없습니다.
								</p>
							</div>
						</div>

						{/* 참가 자격 */}
						<div>
							<label
								htmlFor="qualifications"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<AlertCircle className="w-4 h-4 mr-2" />
								<span>참가 자격</span>
							</label>
							<Textarea
								id="qualifications"
								{...register('qualifications')}
								placeholder="참가자가 갖춰야 할 자격이나 조건을 입력하세요 (선택사항)"
								rows={4}
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
							/>
							<p className="text-xs text-gray-500 mt-1">
								나이 제한, 경험 요구사항, 특별한 조건 등을 명시해주세요.
							</p>
						</div>

						{/* 준비물 */}
						<div>
							<label
								htmlFor="materials"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Package className="w-4 h-4 mr-2" />
								<span>준비물</span>
							</label>
							<Textarea
								id="materials"
								{...register('materials')}
								placeholder="참가자가 준비해야 할 물품이나 복장을 입력하세요 (선택사항)"
								rows={4}
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
							/>
							<p className="text-xs text-gray-500 mt-1">
								개인이 지참해야 할 물품, 복장 등을 명시해주세요.
							</p>
						</div>

						{/* 버튼들 */}
						<div
							className={`${isModal ? 'flex justify-end gap-3' : 'flex justify-end'} pt-4`}
						>
							{isModal && (
								<Button
									type="button"
									onClick={onCancel}
									variant="outline"
									disabled={isLoading}
									className="flex items-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
								>
									취소
								</Button>
							)}
							<Button
								type="submit"
								disabled={isLoading || formState.isSubmitting}
								className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
										<span>저장 중...</span>
									</>
								) : (
									<span>{isEditing ? '수정하기' : '생성하기'}</span>
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		)
	},
)

VolunteerActivityForm.displayName = 'VolunteerActivityForm'

export default VolunteerActivityForm
