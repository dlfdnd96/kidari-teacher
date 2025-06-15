'use client'

import React, { memo } from 'react'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ProfileCardProps } from '@/types/profile'
import { ZodType } from '@/shared/types'
import { Enum, ZodEnum } from '@/enums'
import Image from 'next/image'
import { TZDate } from '@date-fns/tz'
import { TIME_ZONE } from '@/constants/date'

const ProfileCard = memo(
	({ user, onEdit, canEdit = true }: ProfileCardProps) => {
		const getRoleLabel = (role: ZodType<typeof ZodEnum.Role>) => {
			switch (role) {
				case 'ADMIN':
					return '관리자'
				case 'USER':
					return '사용자'
				default:
					return '사용자'
			}
		}

		const getRoleBadgeColor = (role: ZodType<typeof ZodEnum.Role>) => {
			switch (role) {
				case 'ADMIN':
					return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
				case 'USER':
					return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
				default:
					return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
			}
		}

		return (
			<div className="relative">
				{/* 헤더 */}
				<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<User className="w-7 h-7 text-white mr-3" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
									프로필 정보
								</h2>
								<p className="text-blue-100 text-sm">
									내 기본 정보를 확인하고 관리하세요
								</p>
							</div>
						</div>
						{canEdit && (
							<Button
								onClick={onEdit}
								variant="secondary"
								size="sm"
								className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50"
							>
								<Edit className="w-4 h-4 mr-1.5" />
								수정
							</Button>
						)}
					</div>
				</div>

				{/* 프로필 내용 */}
				<div className="p-6 sm:p-8">
					<div className="flex flex-col sm:flex-row items-start gap-6">
						{/* 프로필 이미지 */}
						<div className="flex-shrink-0">
							<div className="relative">
								{user.image ? (
									<Image
										src={user.image}
										width={1000}
										height={1000}
										alt={`${user.name}의 프로필`}
										className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
										<User className="w-12 h-12 text-white" />
									</div>
								)}
								{/* 역할 뱃지 */}
								<div className="absolute -bottom-2 -right-2">
									<Badge
										className={`${getRoleBadgeColor(user.role)} text-xs font-medium px-2 py-1`}
									>
										{user.role === Enum.Role.ADMIN && (
											<Shield className="w-3 h-3 mr-1" />
										)}
										{getRoleLabel(user.role)}
									</Badge>
								</div>
							</div>
						</div>

						{/* 프로필 정보 */}
						<div className="flex-1 space-y-4">
							{/* 이름 */}
							<div className="flex items-center gap-3">
								<User className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
								<div>
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										이름
									</div>
									<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										{user.name}
									</div>
								</div>
							</div>

							{/* 이메일 */}
							<div className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
								<div>
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										이메일
									</div>
									<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										{user.email}
									</div>
								</div>
							</div>

							{/* 가입일 */}
							<div className="flex items-center gap-3">
								<Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
								<div>
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										가입일
									</div>
									<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										{format(
											new TZDate(user.createdAt, TIME_ZONE.SEOUL),
											'yyyy년 M월 d일',
											{
												locale: ko,
											},
										)}
									</div>
								</div>
							</div>

							{/* 최근 업데이트 */}
							{user.updatedAt !== user.createdAt && (
								<div className="flex items-center gap-3">
									<Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
									<div>
										<div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
											최근 수정
										</div>
										<div className="text-sm text-gray-700 dark:text-gray-300">
											{format(
												new TZDate(user.updatedAt, TIME_ZONE.SEOUL),
												'yyyy년 M월 d일 HH:mm',
												{
													locale: ko,
												},
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	},
)

ProfileCard.displayName = 'ProfileCard'

export default ProfileCard
