import React from 'react'
import { User } from 'lucide-react'
import { Input, FieldError } from '@/components/ui'
import type { FormFieldProps } from '@/types/user-profile-setup'

export const NameField = React.memo<FormFieldProps>(
	({ register, error, disabled = false }) => {
		return (
			<div className="flex items-start gap-3">
				<User className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
				<div className="flex-1">
					<label
						htmlFor="user-name"
						className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
					>
						이름 *
					</label>
					<Input
						id="user-name"
						{...register('name')}
						placeholder="이름을 입력하세요"
						disabled={disabled}
						className="w-full h-12"
						data-cy="setup-profile-name-input"
						aria-required="true"
						aria-describedby={error ? 'name-error' : undefined}
					/>
					<FieldError error={error?.message} id="name-error" />
				</div>
			</div>
		)
	},
)

NameField.displayName = 'NameField'
