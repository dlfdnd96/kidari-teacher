import React from 'react'
import { Building } from 'lucide-react'
import { Input } from '@/components/ui'
import type { OrganizationFieldProps } from '@/types/user-profile-setup'

export const OrganizationField = React.memo<OrganizationFieldProps>(
	({ register, disabled = false }) => {
		return (
			<div className="flex items-start gap-3">
				<Building className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
				<div className="flex-1">
					<label
						htmlFor="user-organization"
						className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
					>
						소속 기관
					</label>
					<Input
						id="user-organization"
						{...register('organization')}
						placeholder="소속 기관을 입력하세요"
						disabled={disabled}
						className="w-full h-12"
						data-cy="setup-user-profile-organization-input"
						aria-label="소속 기관"
					/>
				</div>
			</div>
		)
	},
)

OrganizationField.displayName = 'OrganizationField'
