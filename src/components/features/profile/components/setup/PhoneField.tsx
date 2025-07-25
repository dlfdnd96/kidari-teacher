import React from 'react'
import { Phone } from 'lucide-react'
import { Input, FieldError } from '@/components/ui'
import type { PhoneFieldProps } from '@/types/user-profile-setup'

export const PhoneField = React.memo<PhoneFieldProps>(
	({ value, onChange, error, disabled = false }) => {
		return (
			<div className="flex items-start gap-3">
				<Phone className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
				<div className="flex-1">
					<label
						htmlFor="user-phone"
						className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
					>
						연락처 *
					</label>
					<Input
						id="user-phone"
						type="tel"
						placeholder="010-1234-5678"
						value={value}
						onChange={onChange}
						disabled={disabled}
						className="w-full h-12"
						data-cy="setup-user-profile-phone-input"
						aria-required="true"
						aria-describedby={error ? 'phone-error' : undefined}
					/>
					<FieldError error={error?.message} id="phone-error" />
				</div>
			</div>
		)
	},
)

PhoneField.displayName = 'PhoneField'
