'use client'

import React, { memo, useMemo } from 'react'
import {
	Building,
	Calendar,
	Edit,
	Phone,
	Plus,
	User,
	Briefcase,
} from 'lucide-react'
import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserProfileCardProps } from '@/types/user-profile'
import { formatPhoneNumber } from '@/utils/phone'
import { TIME_ZONE } from '@/constants/date'
import { PROFESSION_LABELS } from '@/constants/user-profile'

const EmptyProfileState = memo(
	({ canEdit, onCreate }: { canEdit: boolean; onCreate?: () => void }) => (
		<div className="p-6">
			<div className="text-center py-12">
				<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<User className="w-8 h-8 text-gray-400" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					추가 정보가 없습니다
				</h3>
				<p className="text-gray-500 mb-6 max-w-sm mx-auto">
					휴대폰 번호, 생년월일, 소속 기관, 직업 등의 정보를 추가하여 프로필을
					완성하세요
				</p>
				{canEdit && onCreate && (
					<Button
						onClick={onCreate}
						className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center border-0"
						data-cy="create-user-profile-button"
					>
						<Plus className="w-4 h-4 mr-2" />
						프로필 정보 추가
					</Button>
				)}
			</div>
		</div>
	),
)

EmptyProfileState.displayName = 'EmptyProfileState'

const ProfileInfoField = memo(
	({
		icon: Icon,
		label,
		children,
		dataCy,
	}: {
		icon: React.ComponentType<{ className?: string }>
		label: string
		children: React.ReactNode
		dataCy?: string
	}) => (
		<div className="flex items-start gap-3">
			<Icon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
				<div data-cy={dataCy}>{children}</div>
			</div>
		</div>
	),
)

ProfileInfoField.displayName = 'ProfileInfoField'

const ProfessionBadges = memo(({ professions }: { professions?: string[] }) => {
	if (!professions || professions.length === 0) {
		return <div className="text-base font-medium text-gray-900">정보 없음</div>
	}

	return (
		<div className="flex flex-wrap gap-2">
			{professions.map((profession) => (
				<Badge
					key={profession}
					variant="secondary"
					className="bg-gray-50 text-gray-700 border-gray-200"
				>
					{PROFESSION_LABELS[profession as keyof typeof PROFESSION_LABELS] ||
						profession}
				</Badge>
			))}
		</div>
	)
})

ProfessionBadges.displayName = 'ProfessionBadges'

const ProfileHeader = memo(
	({ canEdit, onEdit }: { canEdit: boolean; onEdit?: () => void }) => (
		<div className="border-b border-gray-200 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<User className="w-5 h-5 text-gray-500 mr-3" />
					<div>
						<h2 className="text-xl font-semibold text-gray-900 mb-1">
							추가 프로필 정보
						</h2>
					</div>
				</div>
				{canEdit && onEdit && (
					<Button
						onClick={onEdit}
						variant="outline"
						size="sm"
						className="cursor-pointer"
						data-cy="edit-user-profile-button"
					>
						<Edit className="w-4 h-4 mr-1.5" />
						수정
					</Button>
				)}
			</div>
		</div>
	),
)

ProfileHeader.displayName = 'ProfileHeader'

const UserProfileCard = memo(
	({ profile, onEdit, onCreate, canEdit = false }: UserProfileCardProps) => {
		const formattedUpdatedAt = useMemo(() => {
			if (!profile) {
				return ''
			}

			return format(
				new TZDate(profile.updatedAt, TIME_ZONE.SEOUL),
				'yyyy년 M월 d일 HH:mm',
				{ locale: ko },
			)
		}, [profile])

		const formattedBirthDate = useMemo(() => {
			if (!profile?.birthDate) {
				return '정보 없음'
			}

			return format(profile.birthDate, 'yyyy년 M월 d일', { locale: ko })
		}, [profile?.birthDate])

		const formattedPhone = useMemo(() => {
			if (!profile?.phone) {
				return '정보 없음'
			}

			return formatPhoneNumber(profile.phone)
		}, [profile?.phone])

		if (!profile) {
			return (
				<div
					className="bg-white border border-gray-200 rounded-lg"
					data-cy="user-profile-card-empty"
				>
					<ProfileHeader canEdit={canEdit} />
					<EmptyProfileState canEdit={canEdit} onCreate={onCreate} />
				</div>
			)
		}

		return (
			<div
				className="bg-white border border-gray-200 rounded-lg"
				data-cy="user-profile-card"
			>
				<ProfileHeader canEdit={canEdit} onEdit={onEdit} />

				{/* 프로필 정보 */}
				<div className="p-6">
					<div className="space-y-6">
						{/* 휴대폰 번호 */}
						<ProfileInfoField
							icon={Phone}
							label="휴대폰 번호"
							dataCy="user-profile-phone"
						>
							<div className="text-base font-medium text-gray-900">
								{formattedPhone}
							</div>
						</ProfileInfoField>

						{/* 직업 */}
						<ProfileInfoField icon={Briefcase} label="직업">
							<ProfessionBadges professions={profile.professions} />
						</ProfileInfoField>

						{/* 소속 기관 */}
						<ProfileInfoField icon={Building} label="소속 기관">
							<div className="text-base font-medium text-gray-900 break-all">
								{profile.organization || '정보 없음'}
							</div>
						</ProfileInfoField>

						{/* 생년월일 */}
						<ProfileInfoField icon={Calendar} label="생년월일">
							<div className="text-base font-medium text-gray-900">
								{formattedBirthDate}
							</div>
						</ProfileInfoField>

						{/* 프로필 상태 정보 */}
						<div className="pt-4 border-t border-gray-200">
							<ProfileInfoField icon={Calendar} label="최근 수정">
								<div className="text-sm text-gray-700">
									{formattedUpdatedAt}
								</div>
							</ProfileInfoField>
						</div>
					</div>
				</div>
			</div>
		)
	},
)

UserProfileCard.displayName = 'UserProfileCard'

export default UserProfileCard
