'use client'

import React, { memo } from 'react'
import {
	Building,
	Calendar,
	Edit,
	MapPin,
	Phone,
	Plus,
	User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProfileCardProps } from '@/types/user-profile'
import { formatPhoneNumber } from '@/utils/phone'
import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'
import { ko } from 'date-fns/locale'

const UserProfileCard = memo(
	({ profile, onEdit, onCreate, canEdit = false }: UserProfileCardProps) => {
		if (!profile) {
			return (
				<div className="relative">
					{/* 헤더 */}
					<div className="bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 p-6 sm:p-8">
						<div className="flex items-center">
							<User className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									추가 프로필 정보
								</h2>
								<p className="text-green-100 text-sm">
									상세한 프로필 정보를 추가해보세요
								</p>
							</div>
						</div>
					</div>

					{/* 빈 상태 컨텐츠 */}
					<div className="p-6 sm:p-8">
						<div className="text-center py-12">
							<div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<User className="w-10 h-10 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
								추가 정보가 없습니다
							</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
								휴대폰 번호, 생년월일, 소속 기관 등의 정보를 추가하여 프로필을
								완성하세요
							</p>
							{canEdit && onCreate && (
								<Button
									onClick={onCreate}
									className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<Plus className="w-4 h-4 mr-2" />
									<span>프로필 정보 추가</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className="relative">
				{/* 헤더 */}
				<div className="bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 p-6 sm:p-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<User className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									추가 프로필 정보
								</h2>
								<p className="text-green-100 text-sm">
									상세한 개인 정보를 확인하고 관리하세요
								</p>
							</div>
						</div>
						{canEdit && onEdit && (
							<Button
								onClick={onEdit}
								variant="secondary"
								size="sm"
								className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 cursor-pointer"
							>
								<Edit className="w-4 h-4 mr-1.5" />
								수정
							</Button>
						)}
					</div>
				</div>

				{/* 프로필 정보 */}
				<div className="p-6 sm:p-8">
					<div className="space-y-6">
						{/* 휴대폰 번호 */}
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
								<Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
									휴대폰 번호
								</div>
								<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{profile.phone
										? formatPhoneNumber(profile.phone)
										: '정보 없음'}
								</div>
							</div>
						</div>

						{/* 생년월일 */}
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
								<Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
									생년월일
								</div>
								<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{profile.birthDate
										? format(profile.birthDate, 'yyyy년 M월 d일', {
												locale: ko,
											})
										: '정보 없음'}
								</div>
							</div>
						</div>

						{/* 소속 기관 */}
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
								<Building className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
									소속 기관
								</div>
								<div className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-all">
									{profile.organization || '정보 없음'}
								</div>
							</div>
						</div>

						{/* 주소 */}
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
								<MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
									주소
								</div>
								<div className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-all leading-relaxed">
									{profile.address || '정보 없음'}
								</div>
							</div>
						</div>

						{/* 프로필 상태 정보 */}
						<div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
									<Calendar className="w-6 h-6 text-gray-500 dark:text-gray-400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										최근 수정
									</div>
									<div className="text-sm text-gray-700 dark:text-gray-300">
										{format(
											new TZDate(profile.updatedAt, TIME_ZONE.SEOUL),
											'yyyy년 M월 d일 HH:mm',
											{
												locale: ko,
											},
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	},
)

UserProfileCard.displayName = 'UserProfileCard'

export default UserProfileCard
