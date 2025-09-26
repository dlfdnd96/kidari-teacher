'use client'

import {
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	XAxis,
	YAxis,
} from 'recharts'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

export interface BarChartData {
	[key: string]: string | number
}

export type BarChartSize = 'sm' | 'md' | 'lg'

export interface BarChartProps {
	data: BarChartData[]
	xKey: string
	yKey: string
	title?: string
	description?: string
	showGrid?: boolean
	showTooltip?: boolean
	size?: BarChartSize
	className?: string
	color?: string
	formatXAxisLabel?: (value: string | number) => string
	formatYAxisLabel?: (value: string | number) => string
	formatTooltipLabel?: (value: string) => string
}

const DEFAULT_COLOR = 'hsl(var(--chart-1))'

const CHART_COLORS = [
	'var(--chart-1)',
	'var(--chart-2)',
	'var(--chart-3)',
	'var(--chart-4)',
	'var(--chart-5)',
] as const

const SIZE_CLASSES: Record<BarChartSize, string> = {
	sm: 'h-[200px]',
	md: 'h-[250px]',
	lg: 'h-[300px]',
} as const

const DEFAULT_PROPS = {
	title: '막대 차트',
	showGrid: true,
	showTooltip: true,
	size: 'md' as BarChartSize,
	color: DEFAULT_COLOR,
} as const

export function BarChart({
	data,
	xKey,
	yKey,
	title = DEFAULT_PROPS.title,
	description,
	showGrid = DEFAULT_PROPS.showGrid,
	showTooltip = DEFAULT_PROPS.showTooltip,
	size = DEFAULT_PROPS.size,
	className,
	color = DEFAULT_PROPS.color,
	formatXAxisLabel,
	formatYAxisLabel,
	formatTooltipLabel,
}: BarChartProps) {
	const chartConfig: ChartConfig = {
		[yKey]: {
			label: formatTooltipLabel ? formatTooltipLabel(yKey) : yKey,
			color: color,
		},
		chart1: { color: 'hsl(var(--chart-1))' },
		chart2: { color: 'hsl(var(--chart-2))' },
		chart3: { color: 'hsl(var(--chart-3))' },
		chart4: { color: 'hsl(var(--chart-4))' },
		chart5: { color: 'hsl(var(--chart-5))' },
	}

	if (!data || data.length === 0) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent
					className={cn('flex items-center justify-center', SIZE_CLASSES[size])}
				>
					<p className="text-sm text-muted-foreground">
						표시할 데이터가 없습니다
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className={cn('w-full', SIZE_CLASSES[size])}
				>
					<RechartsBarChart
						data={data}
						margin={{
							top: 5,
							right: 10,
							left: 10,
							bottom: 5,
						}}
						accessibilityLayer
					>
						{showGrid && (
							<CartesianGrid
								strokeDasharray="3 3"
								className="stroke-muted/20"
								vertical={false}
							/>
						)}
						<XAxis
							dataKey={xKey}
							tickLine={false}
							axisLine={false}
							className="text-xs fill-muted-foreground"
							tickFormatter={formatXAxisLabel}
							interval="preserveStartEnd"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							className="text-xs fill-muted-foreground"
							tickFormatter={formatYAxisLabel}
							width={40}
						/>
						{showTooltip && (
							<ChartTooltip
								cursor={{
									fill: color,
									fillOpacity: 0.1,
								}}
								content={<ChartTooltipContent indicator="dashed" />}
							/>
						)}
						<Bar dataKey={yKey} fill={color} radius={[2, 2, 0, 0]}>
							{data.map((_entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={CHART_COLORS[index % CHART_COLORS.length]}
								/>
							))}
						</Bar>
					</RechartsBarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
