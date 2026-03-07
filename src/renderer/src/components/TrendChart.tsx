'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card } from './ui/card'

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
  displayIncomeChart: boolean
  displayExpenseChart: boolean
}
export function TrendChart({
  data,
  displayIncomeChart,
  displayExpenseChart
}: Props): React.JSX.Element {
  return (
    <Card className="px-6">
      <div className="relative">
        <div className="absolute font-bold text-5xl text-right right-3 top-7 opacity-30 font-mono">
          {dayjs().year()}
        </div>
        <ChartContainer config={chartConfig} className="h-100 w-full">
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

            {displayIncomeChart && (
              <Bar dataKey="income" fill="var(--color-income)" radius={[0, 0, 4, 4]} stackId="a" />
            )}

            {displayExpenseChart && (
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            )}
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
