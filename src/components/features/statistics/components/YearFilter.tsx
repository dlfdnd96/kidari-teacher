'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface YearFilterProps {
	availableYears: number[]
	selectedYear?: number
	onYearChange: (year?: number) => void
}

export function YearFilter({
	availableYears,
	selectedYear,
	onYearChange,
}: YearFilterProps) {
	const handleValueChange = (value: string) => {
		if (value === 'all') {
			onYearChange(undefined)
		} else {
			onYearChange(Number(value))
		}
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium text-muted-foreground">연도:</span>
			<Select
				value={selectedYear ? String(selectedYear) : 'all'}
				onValueChange={handleValueChange}
			>
				<SelectTrigger className="w-[140px]" size="sm">
					<SelectValue placeholder="연도 선택" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">
						<span className="text-foreground">전체 연도</span>
					</SelectItem>
					{availableYears.map((year) => (
						<SelectItem key={year} value={String(year)}>
							<span className="text-foreground">{year}년</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
