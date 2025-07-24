import React from 'react'
import { Save } from 'lucide-react'
import {
	NameField,
	EmailField,
	PhoneField,
	OrganizationField,
	ProfessionField,
} from './index'
import { useProfileSetup } from './hooks/useProfileSetup'
import type { ProfileSetupFormProps } from '@/types/user-profile-setup'

export const ProfileSetupForm = React.memo<ProfileSetupFormProps>(
	({ className = '' }) => {
		const {
			displayPhone,
			selectedProfessions,
			isLoading,
			errors,
			register,
			handleSubmit,
			onSubmit,
			handlePhoneChange,
			handleProfessionsChange,
		} = useProfileSetup()

		return (
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={`space-y-8 ${className}`}
				role="form"
				aria-label="프로필 설정 폼"
			>
				{/* 사용자 기본 정보 입력 섹션 */}
				<div className="space-y-6">
					<NameField
						register={register}
						error={errors.name}
						disabled={isLoading}
					/>

					<EmailField register={register} disabled={isLoading} />

					<PhoneField
						value={displayPhone}
						onChange={handlePhoneChange}
						error={errors.phone}
						disabled={isLoading}
					/>

					<ProfessionField
						selectedProfessions={selectedProfessions}
						onProfessionsChange={handleProfessionsChange}
						error={errors.professions}
						disabled={isLoading}
					/>

					<OrganizationField register={register} disabled={isLoading} />
				</div>

				{/* 프로필 생성 버튼 영역 */}
				<div className="pt-8 border-t border-gray-200 dark:border-gray-700">
					<div className="flex justify-center gap-4">
						<button
							type="submit"
							disabled={isLoading}
							className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-sm font-medium cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
							data-cy="setup-profile-submit-button"
							aria-label="프로필 생성하기"
						>
							{isLoading ? (
								<>
									<div
										className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"
										aria-hidden="true"
									/>
									<span>프로필 생성 중...</span>
								</>
							) : (
								<>
									<Save className="w-4 h-4" aria-hidden="true" />
									<span>프로필 생성하기</span>
								</>
							)}
						</button>
					</div>
				</div>
			</form>
		)
	},
)

ProfileSetupForm.displayName = 'ProfileSetupForm'
