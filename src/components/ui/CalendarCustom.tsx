'use client'

import * as React from 'react'
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from 'lucide-react'
import {
	DayPicker,
	DropdownProps,
	getDefaultClassNames,
} from 'react-day-picker'
import {
	CalendarDayButton,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
	const defaultClassNames = getDefaultClassNames()

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit', defaultClassNames.root),
				months: cn(
					'flex gap-4 flex-col md:flex-row relative',
					defaultClassNames.months,
				),
				month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
				nav: cn(
					'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-20',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none z-20',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none z-20',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					'w-full flex flex-row-reverse items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5 z-30 relative',
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md z-30',
					defaultClassNames.dropdown_root,
				),
				dropdown: cn(
					'absolute inset-0 opacity-0 z-30',
					defaultClassNames.dropdown,
				),
				caption_label: cn(
					'select-none font-medium',
					captionLayout === 'label'
						? 'text-sm'
						: 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
					defaultClassNames.caption_label,
				),
				table: 'w-full border-collapse',
				weekdays: cn('flex', defaultClassNames.weekdays),
				weekday: cn(
					'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
					defaultClassNames.weekday,
				),
				week: cn('flex w-full mt-2', defaultClassNames.week),
				week_number_header: cn(
					'select-none w-(--cell-size)',
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					'text-[0.8rem] select-none text-muted-foreground',
					defaultClassNames.week_number,
				),
				day: cn(
					'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
					defaultClassNames.day,
				),
				range_start: cn(
					'rounded-l-md bg-accent',
					defaultClassNames.range_start,
				),
				range_middle: cn('rounded-none', defaultClassNames.range_middle),
				range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
				today: cn(
					'bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none',
					defaultClassNames.today,
				),
				outside: cn(
					'text-muted-foreground aria-selected:text-muted-foreground',
					defaultClassNames.outside,
				),
				disabled: cn(
					'text-muted-foreground opacity-50',
					defaultClassNames.disabled,
				),
				hidden: cn('invisible', defaultClassNames.hidden),
				...classNames,
			}}
			modifiers={{
				saturday: (date) => date.getDay() === 6,
				sunday: (date) => date.getDay() === 0,
			}}
			modifiersClassNames={{
				saturday: 'text-blue-500',
				sunday: 'text-red-500',
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					)
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon className={cn('size-4', className)} {...props} />
						)
					}

					if (orientation === 'right') {
						return (
							<ChevronRightIcon
								className={cn('size-4', className)}
								{...props}
							/>
						)
					}

					return (
						<ChevronDownIcon className={cn('size-4', className)} {...props} />
					)
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					)
				},
				Dropdown: (props: DropdownProps) => {
					const { options, value, onChange } = props

					const handleValueChange = (newValue: string) => {
						if (onChange) {
							const syntheticEvent = {
								target: {
									value: newValue,
								},
							} as React.ChangeEvent<HTMLSelectElement>

							onChange(syntheticEvent)
						}
					}

					return (
						<div className="relative z-50">
							<Select
								value={value?.toString()}
								onValueChange={handleValueChange}
							>
								<SelectTrigger className="z-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="z-50">
									<SelectGroup>
										{options?.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value.toString()}
												disabled={option.disabled}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					)
				},
				...components,
			}}
			{...props}
		/>
	)
}

export { Calendar, CalendarDayButton }
