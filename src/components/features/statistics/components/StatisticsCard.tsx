import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ChangeType = 'increase' | 'decrease'

interface StatisticsChange {
	value: number
	type: ChangeType
}

interface StatisticsCardProps
	extends VariantProps<typeof statisticsCardVariants> {
	title: string
	value: string | number
	change?: StatisticsChange
	icon?: LucideIcon
	description?: string
	className?: string
}

const statisticsCardVariants = cva(
	'rounded-xl border bg-card text-card-foreground shadow @container/card',
	{
		variants: {
			variant: {
				default: '',
				primary: 'border-primary/20',
				success: 'border-emerald-500/20',
				warning: 'border-amber-500/20',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const changeVariants = cva(
	'items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs',
	{
		variants: {
			type: {
				increase: 'text-emerald-600 dark:text-emerald-400',
				decrease: 'text-red-600 dark:text-red-400',
			},
		},
	},
)

const CHANGE_ICONS: Record<
	ChangeType,
	React.ComponentType<{ className?: string }>
> = {
	increase: TrendingUp,
	decrease: TrendingDown,
} as const

export function StatisticsCard({
	title,
	value,
	change,
	icon: Icon,
	description,
	variant,
	className,
}: StatisticsCardProps) {
	const formatChangeValue = (changeValue: number): string => {
		const sign = changeValue > 0 ? '+' : ''
		return `${sign}${changeValue}%`
	}

	const renderChangeIndicator = () => {
		if (!change) {
			return null
		}

		const ChangeIcon = CHANGE_ICONS[change.type]

		return (
			<div className="absolute right-4 top-4">
				<div
					className={changeVariants({ type: change.type })}
					aria-label={`${change.type === 'increase' ? '증가' : '감소'}: ${formatChangeValue(change.value)}`}
				>
					<ChangeIcon className="size-3" />
					{formatChangeValue(change.value)}
				</div>
			</div>
		)
	}

	return (
		<Card
			className={cn(statisticsCardVariants({ variant }), className)}
			role="article"
			aria-labelledby="statistics-title"
		>
			<div className="flex flex-col space-y-1.5 p-6 relative">
				<div className="text-sm text-muted-foreground" id="statistics-title">
					{title}
				</div>
				<div className="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
					<span aria-label={`값: ${value}`}>{value}</span>
				</div>
				{renderChangeIndicator()}
			</div>
			{(description || Icon) && (
				<div className="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
					{Icon && (
						<div className="line-clamp-1 flex gap-2 font-medium">
							{description}
							<Icon className="size-4" />
						</div>
					)}
					{!Icon && description && (
						<div className="text-muted-foreground">{description}</div>
					)}
				</div>
			)}
		</Card>
	)
}
