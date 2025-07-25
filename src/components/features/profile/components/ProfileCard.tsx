'use client'

import React, { memo, useMemo } from 'react'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Image from 'next/image'
import { TZDate } from '@date-fns/tz'
import { Badge, Button } from '@/components/ui'
import type { ProfileCardProps } from '@/types/profile'
import { ZodType } from '@/shared/types'
import { Enum, ZodEnum } from '@/enums'
import { TIME_ZONE } from '@/constants/date'
import { UserEntitySchema } from '@/shared/schemas/user'

const getRoleLabel = (role: ZodType<typeof ZodEnum.Role>): string => {
	switch (role) {
		case 'ADMIN':
			return '관리자'
		case 'USER':
			return '사용자'
		default:
			return '사용자'
	}
}

const getRoleBadgeColor = (role: ZodType<typeof ZodEnum.Role>): string => {
	switch (role) {
		case 'ADMIN':
			return 'bg-red-50 text-red-700 border-red-200'
		case 'USER':
			return 'bg-blue-50 text-blue-700 border-blue-200'
		default:
			return 'bg-gray-50 text-gray-700 border-gray-200'
	}
}

const ProfileImage = memo(
	({ user }: { user: ZodType<typeof UserEntitySchema> }) => {
		const badgeColor = useMemo(() => getRoleBadgeColor(user.role), [user.role])
		const roleLabel = useMemo(() => getRoleLabel(user.role), [user.role])
		const userName = user.name || '사용자'
		return (
			<div className="flex-shrink-0">
				<div className="relative">
					{user.image ? (
						<Image
							src={user.image}
							width={80}
							height={80}
							alt={`${userName}의 프로필`}
							className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
						/>
					) : (
						<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
							<User className="w-8 h-8 text-gray-500" />
						</div>
					)}
					{/* 역할 뱃지 */}
					<div className="absolute -bottom-1 -right-1">
						<Badge
							className={`${badgeColor} text-xs font-medium px-2 py-1 border`}
						>
							{user.role === Enum.Role.ADMIN && (
								<Shield className="w-3 h-3 mr-1" />
							)}
							{roleLabel}
						</Badge>
					</div>
				</div>
			</div>
		)
	},
)

ProfileImage.displayName = 'ProfileImage'

const InfoField = memo(
	({
		icon: Icon,
		label,
		value,
		dataCy,
	}: {
		icon: React.ComponentType<{ className?: string }>
		label: string
		value: string
		dataCy?: string
	}) => (
		<div className="flex items-start gap-3">
			<Icon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
			<div>
				<div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
				<div className="text-base font-medium text-gray-900" data-cy={dataCy}>
					{value}
				</div>
			</div>
		</div>
	),
)

InfoField.displayName = 'InfoField'

const ProfileCard = memo(
	({ user, onEdit, canEdit = true }: ProfileCardProps) => {
		const formattedCreatedAt = useMemo(() => {
			return format(
				new TZDate(user.createdAt, TIME_ZONE.SEOUL),
				'yyyy년 M월 d일',
				{ locale: ko },
			)
		}, [user.createdAt])

		const formattedUpdatedAt = useMemo(() => {
			return format(
				new TZDate(user.updatedAt, TIME_ZONE.SEOUL),
				'yyyy년 M월 d일 HH:mm',
				{ locale: ko },
			)
		}, [user.updatedAt])

		const isUpdated = useMemo(() => {
			return user.updatedAt !== user.createdAt
		}, [user.updatedAt, user.createdAt])

		const userName = user.name || '사용자'
		const userEmail = user.email || '이메일 없음'

		return (
			<div
				className="bg-white border border-gray-200 rounded-lg"
				data-cy="profile-card"
			>
				{/* 헤더 */}
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-1">
								프로필 정보
							</h2>
						</div>
						{canEdit && (
							<Button
								onClick={onEdit}
								variant="outline"
								size="sm"
								className="cursor-pointer"
								data-cy="edit-profile-button"
							>
								<Edit className="w-4 h-4 mr-1.5" />
								수정
							</Button>
						)}
					</div>
				</div>

				{/* 프로필 내용 */}
				<div className="p-6">
					<div className="flex flex-col sm:flex-row items-start gap-6">
						{/* 프로필 이미지 */}
						<ProfileImage user={user} />

						{/* 프로필 정보 */}
						<div className="flex-1 space-y-4">
							{/* 이름 */}
							<InfoField
								icon={User}
								label="이름"
								value={userName}
								dataCy="profile-name"
							/>

							{/* 이메일 */}
							<InfoField
								icon={Mail}
								label="이메일"
								value={userEmail}
								dataCy="profile-email"
							/>

							{/* 가입일 */}
							<InfoField
								icon={Calendar}
								label="가입일"
								value={formattedCreatedAt}
							/>

							{/* 최근 업데이트 */}
							{isUpdated && (
								<div className="flex items-start gap-3">
									<Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
									<div>
										<div className="text-sm font-medium text-gray-500 mb-1">
											최근 수정
										</div>
										<div className="text-sm text-gray-700">
											{formattedUpdatedAt}
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
