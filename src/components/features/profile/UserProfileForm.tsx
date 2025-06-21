'use client'

import React, { memo, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Building,
	CalendarIcon,
	MapPin,
	Phone,
	Save,
	User,
	X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useErrorModal } from '@/components/common/ErrorModal/ErrorModalContext'
import {
	ERROR_MESSAGES,
	handleClientError,
	isValidationError,
} from '@/utils/error'
import {
	CreateUserProfileInputSchema,
	UpdateUserProfileInputSchema,
} from '@/shared/schemas/user'
import { trpc } from '@/components/providers/TrpcProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserProfileFormProps } from '@/types/user-profile'
import { formatPhoneNumber, removePhoneNumberFormat } from '@/utils/phone'
import {
	CalendarCustom,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'

const UserProfileForm = memo(
	({ onCancel, isSetup = false, initialData }: UserProfileFormProps) => {
		const { data: session } = useSession()
		const router = useRouter()
		const { showError } = useErrorModal()

		const utils = trpc.useUtils()

		const isEditing = !!initialData

		const { register, handleSubmit, formState, setValue, watch } = useForm({
			defaultValues: {
				phone: initialData?.phone,
				birthDate: initialData?.birthDate,
				organization: initialData?.organization,
				address: initialData?.address,
			},
		})
		const [displayPhone, setDisplayPhone] = useState(
			initialData?.phone ? formatPhoneNumber(initialData.phone) : '',
		)

		const createProfileMutation = trpc.user.createUserProfile.useMutation({
			onSuccess: async () => {
				await utils.user.getUserProfile.invalidate()
				router.refresh()
				onCancel()
			},
			onError: (error) => {
				handleClientError(error, showError, '프로필 생성 오류')
			},
		})

		const updateProfileMutation = trpc.user.updateUserProfile.useMutation({
			onSuccess: async () => {
				await utils.user.getUserProfile.invalidate()
				router.refresh()
				onCancel()
			},
			onError: (error) => {
				handleClientError(error, showError, '프로필 수정 오류')
			},
		})

		const handlePhoneChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				const formatted = formatPhoneNumber(value)
				setDisplayPhone(formatted)

				const numbersOnly = removePhoneNumberFormat(formatted)
				setValue('phone', numbersOnly)
			},
			[setValue],
		)

		const onSubmit = useCallback(
			async (data: unknown) => {
				if (!session?.user) {
					handleClientError(
						ERROR_MESSAGES.AUTHENTICATION_ERROR,
						showError,
						'인증 오류',
					)
					return
				}

				try {
					if (isEditing) {
						const validatedData = UpdateUserProfileInputSchema.parse(data)
						await updateProfileMutation.mutateAsync(validatedData)
					} else {
						const validatedData = CreateUserProfileInputSchema.parse(data)
						await createProfileMutation.mutateAsync(validatedData)
					}
				} catch (error: unknown) {
					if (isValidationError(error)) {
						handleClientError(error, showError, '입력 검증 오류')
					} else {
						handleClientError(
							error,
							showError,
							isEditing ? '프로필 수정 오류' : '프로필 생성 오류',
						)
					}
				}
			},
			[
				createProfileMutation,
				updateProfileMutation,
				session,
				showError,
				isEditing,
			],
		)

		const isLoading =
			createProfileMutation.isPending || updateProfileMutation.isPending

		return (
			<div className="relative">
				{/* 헤더 */}
				<div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 sm:p-8">
					<div className="flex items-center">
						<User className="w-7 h-7 text-white mr-3" />
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
								{isSetup
									? '프로필 설정'
									: isEditing
										? '프로필 수정'
										: '추가 정보 입력'}
							</h2>
							<p className="text-blue-100 text-sm">
								{isSetup
									? '서비스 이용을 위해 추가 정보를 입력해주세요'
									: isEditing
										? '프로필 정보를 수정하세요'
										: '추가 정보를 입력하여 프로필을 완성하세요'}
							</p>
						</div>
					</div>
				</div>

				{/* 폼 */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
					<div className="space-y-6">
						{/* 휴대폰 번호 필드 */}
						<div>
							<label
								htmlFor="profile-phone"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Phone className="w-4 h-4 mr-2" />
								<span>휴대폰 번호</span>
							</label>
							<Input
								id="profile-phone"
								type="tel"
								value={displayPhone}
								onChange={handlePhoneChange}
								placeholder="예: 010-1234-5678"
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
							/>
						</div>

						{/* 생년월일 필드 */}
						<div>
							<label
								htmlFor="profile-birthDate"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<CalendarIcon className="w-4 h-4 mr-2" />
								<span>생년월일</span>
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full pl-4 pr-4 text-left font-normal bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base hover:bg-white/70 dark:hover:bg-gray-600/50 transition-all duration-200',
											!watch('birthDate') && 'text-muted-foreground',
										)}
									>
										{watch('birthDate') ? (
											<span className="text-gray-900 dark:text-gray-100">
												{format(watch('birthDate')!, 'yyyy년 M월 d일', {
													locale: ko,
												})}
											</span>
										) : (
											<span className="text-gray-500">
												생년월일을 선택하세요
											</span>
										)}
										<CalendarIcon className="ml-auto h-5 w-5 opacity-50 shrink-0" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<CalendarCustom
										mode="single"
										selected={watch('birthDate') ?? undefined}
										onSelect={(date) => {
											if (!date) {
												return
											}

											const newDate = new TZDate(date, TIME_ZONE.SEOUL)
											newDate.setHours(23, 59, 59, 999)
											setValue('birthDate', newDate)
										}}
										defaultMonth={initialData?.birthDate ?? undefined}
										captionLayout="dropdown"
										startMonth={new Date(1970, 0)}
										locale={ko}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* 소속 기관 필드 */}
						<div>
							<label
								htmlFor="profile-organization"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<Building className="w-4 h-4 mr-2" />
								<span>소속 기관</span>
							</label>
							<Input
								id="profile-organization"
								{...register('organization')}
								placeholder="소속 기관을 입력하세요"
								disabled={isLoading}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
							/>
						</div>

						{/* 주소 필드 */}
						<div>
							<label
								htmlFor="profile-address"
								className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
							>
								<MapPin className="w-4 h-4 mr-2" />
								<span>주소</span>
							</label>
							<Textarea
								id="profile-address"
								{...register('address')}
								placeholder="주소를 입력하세요"
								disabled={isLoading}
								rows={3}
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl text-base focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
							/>
						</div>

						{/* 버튼들 */}
						<div className="flex flex-col sm:flex-row gap-3 pt-6">
							<Button
								type="submit"
								disabled={isLoading || formState.isSubmitting}
								className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
										<span>저장 중...</span>
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-1.5" />
										<span>
											{isSetup
												? '프로필 생성'
												: isEditing
													? '수정 완료'
													: '저장'}
										</span>
									</>
								)}
							</Button>

							{onCancel && (
								<Button
									type="button"
									onClick={onCancel}
									disabled={isLoading}
									variant="outline"
									className="flex-1 flex items-center justify-center bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
								>
									<X className="w-4 h-4 mr-1.5" />
									<span>취소</span>
								</Button>
							)}
						</div>
					</div>
				</form>
			</div>
		)
	},
)

UserProfileForm.displayName = 'UserProfileForm'

export default UserProfileForm
