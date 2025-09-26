'use client'

import {
	Line,
	LineChart as RechartsLineChart,
	XAxis,
	YAxis,
	CartesianGrid,
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

export interface LineChartData {
	[key: string]: string | number
}

export interface LineChartProps {
	data: LineChartData[]
	xKey: string
	yKey: string
	title?: string
	description?: string
	showGrid?: boolean
	showTooltip?: boolean
	size?: 'sm' | 'md' | 'lg'
	className?: string
	color?: string
	formatXAxisLabel?: (value: string | number) => string
	formatYAxisLabel?: (value: string | number) => string
	formatTooltipLabel?: (value: string) => string
}

const defaultColor = 'var(--chart-1)'

const sizeClasses = {
	sm: 'h-[200px]',
	md: 'h-[250px]',
	lg: 'h-[300px]',
}

export function LineChart({
	data,
	xKey,
	yKey,
	title = '추이 차트',
	description,
	showGrid = true,
	showTooltip = true,
	size = 'md',
	className,
	color = defaultColor,
	formatXAxisLabel,
	formatYAxisLabel,
	formatTooltipLabel,
}: LineChartProps) {
	// ChartConfig 생성
	const chartConfig: ChartConfig = {
		[yKey]: {
			label: formatTooltipLabel ? formatTooltipLabel(yKey) : yKey,
			color: color,
		},
	}

	// 데이터 검증
	if (!data || data.length === 0) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent
					className={cn('flex items-center justify-center', sizeClasses[size])}
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
					className={cn('w-full', sizeClasses[size])}
				>
					<RechartsLineChart
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
									stroke: color,
									strokeWidth: 1,
									strokeDasharray: '3 3',
								}}
								content={<ChartTooltipContent indicator="line" />}
							/>
						)}
						<Line
							type="monotone"
							dataKey={yKey}
							stroke={color}
							strokeWidth={2}
							dot={{
								fill: color,
								strokeWidth: 2,
								r: 4,
								className: 'opacity-80',
							}}
							activeDot={{
								r: 5,
								stroke: color,
								strokeWidth: 2,
								fill: 'var(--background)',
							}}
							connectNulls={false}
						/>
					</RechartsLineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
