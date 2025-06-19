'use client'

import React, { memo } from 'react'
import {
	Phone,
	Calendar,
	Building,
	MapPin,
	Edit,
	Plus,
	User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
				<Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
					<div className="p-6 sm:p-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center">
								<User className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									추가 프로필 정보
								</h3>
							</div>
						</div>

						<div className="text-center py-8">
							<div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
								<User className="w-8 h-8 text-gray-400" />
							</div>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								추가 프로필 정보가 없습니다
							</p>
							{canEdit && onCreate && (
								<Button
									onClick={onCreate}
									variant="outline"
									className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600"
								>
									<Plus className="w-4 h-4 mr-1.5" />
									<span>프로필 정보 추가</span>
								</Button>
							)}
						</div>
					</div>
				</Card>
			)
		}

		return (
			<Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
				<div className="p-6 sm:p-8">
					{/* 헤더 */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center">
							<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
								<User className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									추가 프로필 정보
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									상세 정보
								</p>
							</div>
						</div>
						{canEdit && onEdit && (
							<Button
								onClick={onEdit}
								size="sm"
								variant="outline"
								className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<Edit className="w-4 h-4 mr-1.5" />
								<span>수정</span>
							</Button>
						)}
					</div>

					{/* 프로필 정보 그리드 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* 휴대폰 번호 */}
						<div className="flex items-start space-x-3">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
								<Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									휴대폰 번호
								</p>
								<p className="text-gray-900 dark:text-gray-100 break-all">
									{profile.phone ? formatPhoneNumber(profile.phone) : '-'}
								</p>
							</div>
						</div>

						{/* 생년월일 */}
						<div className="flex items-start space-x-3">
							<div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
								<Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									생년월일
								</p>
								<p className="text-gray-900 dark:text-gray-100">
									{profile.birthDate
										? format(profile.birthDate, 'yyyy-MM-dd')
										: '-'}
								</p>
							</div>
						</div>

						{/* 소속 기관 */}
						<div className="flex items-start space-x-3">
							<div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
								<Building className="w-4 h-4 text-green-600 dark:text-green-400" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									소속 기관
								</p>
								<p className="text-gray-900 dark:text-gray-100 break-all">
									{profile.organization || '-'}
								</p>
							</div>
						</div>

						{/* 주소 */}
						<div className="flex items-start space-x-3">
							<div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
								<MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									주소
								</p>
								<p className="text-gray-900 dark:text-gray-100 break-all">
									{profile.address || '-'}
								</p>
							</div>
						</div>
					</div>

					{/* 프로필 상태 */}
					<div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<span className="text-sm text-gray-500 dark:text-gray-400">
									마지막 수정:{' '}
									{format(
										new TZDate(profile.updatedAt, TIME_ZONE.SEOUL),
										'yyyy년 M월 d일 HH:mm',
										{
											locale: ko,
										},
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		)
	},
)

UserProfileCard.displayName = 'UserProfileCard'

export default UserProfileCard
