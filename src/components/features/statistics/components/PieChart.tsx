'use client'

import { Cell, Legend, Pie, PieChart as RechartsPieChart } from 'recharts'
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

export interface PieChartData {
	name: string
	value: number
	fill?: string
}

export type PieChartSize = 'sm' | 'md' | 'lg'

export interface PieChartProps {
	data: PieChartData[]
	title?: string
	description?: string
	showLegend?: boolean
	showTooltip?: boolean
	size?: PieChartSize
	className?: string
	colors?: string[]
}

const DEFAULT_COLORS = [
	'var(--chart-1)',
	'var(--chart-2)',
	'var(--chart-3)',
	'var(--chart-4)',
	'var(--chart-5)',
]

const SIZE_CLASSES: Record<PieChartSize, string> = {
	sm: 'max-h-[200px] aspect-square',
	md: 'max-h-[250px] aspect-square',
	lg: 'max-h-[300px] aspect-square',
} as const

const DEFAULT_PROPS = {
	title: '통계',
	showLegend: false,
	showTooltip: true,
	size: 'md' as PieChartSize,
	colors: DEFAULT_COLORS,
} as const

export function PieChart({
	data,
	title = DEFAULT_PROPS.title,
	description,
	showLegend = DEFAULT_PROPS.showLegend,
	showTooltip = DEFAULT_PROPS.showTooltip,
	size = DEFAULT_PROPS.size,
	className,
	colors = DEFAULT_PROPS.colors,
}: PieChartProps) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: item.fill || colors[index % colors.length],
	}))

	const chartConfig: ChartConfig = chartData.reduce(
		(config: ChartConfig, item) => {
			const key = item.name.toLowerCase().replace(/\s+/g, '')
			config[key] = {
				label: item.name,
				color: item.fill,
			}
			return config
		},
		{},
	)

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className={`w-full ${SIZE_CLASSES[size]}`}
				>
					<RechartsPieChart>
						{showTooltip && (
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
						)}
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius="100%"
							innerRadius="50%"
						>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.fill} />
							))}
						</Pie>
						{showLegend && <Legend />}
					</RechartsPieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
