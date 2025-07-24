import React from 'react'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui'
import type { EmailFieldProps } from '@/types/user-profile-setup'

export const EmailField = React.memo<EmailFieldProps>(
	({ register, disabled = false }) => {
		return (
			<div className="flex items-start gap-3">
				<Mail className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
				<div className="flex-1">
					<label
						htmlFor="user-email"
						className="font-semibold text-gray-900 dark:text-gray-100 mb-3 block"
					>
						이메일 *
					</label>
					<Input
						id="user-email"
						{...register('email')}
						placeholder="이메일을 입력하세요"
						disabled={disabled}
						readOnly
						className="w-full h-12 bg-gray-50 cursor-not-allowed"
						aria-required="true"
						aria-label="이메일 주소 (읽기 전용)"
					/>
				</div>
			</div>
		)
	},
)

EmailField.displayName = 'EmailField'
