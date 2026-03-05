'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  income: {
    label: 'Income',
    color: '#65dc7e'
  },
  expense: {
    label: 'Expense',
    color: '#e06866'
  }
} satisfies ChartConfig

interface Props {
  data: { month: number; income: number; expense: number }[] | undefined
}
export function TrendChart({ data }: Props): React.JSX.Element {
  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <BarChart accessibilityLayer data={data}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            dayjs()
              .month(value - 1)
              .format('MMM')
          }
        />
        <CartesianGrid vertical={false} />
        <Bar dataKey="income" fill="var(--color-income)" radius={[0, 0, 4, 4]} stackId="a" />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} stackId="a" />
      </BarChart>
    </ChartContainer>
  )
}
