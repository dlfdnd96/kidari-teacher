import React from 'react'
import { Briefcase } from 'lucide-react'
import { ProfessionSelector, FieldError } from '@/components/ui'
import type { ProfessionFieldProps } from '@/types/user-profile-setup'

export const ProfessionField = React.memo<ProfessionFieldProps>(
	({ selectedProfessions, onProfessionsChange, error, disabled = false }) => {
		return (
			<div className="flex items-start gap-3">
				<Briefcase className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
				<div className="flex-1">
					<ProfessionSelector
						selectedProfessions={selectedProfessions}
						onProfessionsChange={onProfessionsChange}
						disabled={disabled}
					/>
					<FieldError error={error?.message} id="professions-error" />
				</div>
			</div>
		)
	},
)

ProfessionField.displayName = 'ProfessionField'
