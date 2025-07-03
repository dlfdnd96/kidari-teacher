'use client'

import React, { memo, useState } from 'react'
import { Briefcase, Check, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { PROFESSION_LABELS } from '@/constants/user-profile'
import { ZodEnum } from '@/enums'
import { ZodType } from '@/shared/types'
import { cn } from '@/lib/utils'
import { ProfessionSelectorProps } from '@/types/ui'

const ProfessionSelector = memo<ProfessionSelectorProps>(
	({
		selectedProfessions,
		onProfessionsChange,
		disabled = false,
		className,
	}) => {
		const [open, setOpen] = useState(false)

		const allProfessions = Object.entries(PROFESSION_LABELS).map(
			([key, label]) => ({
				value: key as ZodType<typeof ZodEnum.Profession>,
				label,
			}),
		)

		const handleProfessionToggle = (
			profession: ZodType<typeof ZodEnum.Profession>,
		) => {
			if (disabled) {
				return
			}

			const isSelected = selectedProfessions.includes(profession)
			if (isSelected) {
				onProfessionsChange(selectedProfessions.filter((p) => p !== profession))
			} else {
				onProfessionsChange([...selectedProfessions, profession])
			}
		}

		const handleRemoveProfession = (
			profession: ZodType<typeof ZodEnum.Profession>,
		) => {
			if (disabled) {
				return
			}
			onProfessionsChange(selectedProfessions.filter((p) => p !== profession))
		}

		const clearAll = () => {
			if (disabled) {
				return
			}
			onProfessionsChange([])
		}

		return (
			<div
				className={cn('space-y-3', className)}
				data-cy="user-profile-profession-selector"
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between">
					<label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
						<Briefcase className="w-4 h-4 mr-2" />
						<span>직업 선택 *</span>
						<span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
							(복수 선택 가능)
						</span>
					</label>
					{selectedProfessions.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={clearAll}
							disabled={disabled}
							className="text-xs text-gray-500 hover:text-gray-700 h-auto p-1"
						>
							전체 해제
						</Button>
					)}
				</div>

				{/* 멀티셀렉트 드롭다운 */}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className="w-full justify-between bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl h-12 text-base hover:bg-white/70 dark:hover:bg-gray-600/50 transition-all duration-200"
							data-cy="user-profile-profession-combo-box"
						>
							<span className="text-left">
								{selectedProfessions.length === 0 ? (
									<span className="text-gray-500">직업을 선택하세요</span>
								) : (
									<span className="text-gray-900 dark:text-gray-100">
										{selectedProfessions.length}개 직업 선택됨
									</span>
								)}
							</span>
							<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<Command>
							<CommandInput
								placeholder="직업을 검색하세요..."
								className="h-9"
							/>
							<CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
							<CommandList className="max-h-64">
								<CommandGroup>
									{allProfessions.map((profession) => (
										<CommandItem
											key={profession.value}
											value={profession.label}
											onSelect={() => handleProfessionToggle(profession.value)}
											className="cursor-pointer"
											data-cy={`user-profile-profession-${profession.value}`}
										>
											<div className="flex items-center space-x-2 w-full">
												<div className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded">
													{selectedProfessions.includes(profession.value) && (
														<Check className="h-3 w-3 text-blue-600" />
													)}
												</div>
												<span className="flex-1">{profession.label}</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>

				{/* 선택된 직업 표시 */}
				{selectedProfessions.length > 0 && (
					<div
						className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
						data-cy="selected-user-profile-professions"
					>
						{selectedProfessions.map((profession) => (
							<Badge
								key={profession}
								variant="secondary"
								className="flex items-center gap-1 px-3 py-1 text-sm"
							>
								{PROFESSION_LABELS[profession]}
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => handleRemoveProfession(profession)}
									disabled={disabled}
									className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-gray-500 hover:text-gray-700"
									data-cy={`selected-user-profile-profession-${profession}`}
								>
									<X className="w-3 h-3" />
								</Button>
							</Badge>
						))}
					</div>
				)}
			</div>
		)
	},
)

ProfessionSelector.displayName = 'ProfessionSelector'

export default ProfessionSelector
