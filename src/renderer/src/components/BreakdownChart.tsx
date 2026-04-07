import React, { useMemo } from 'react'
import { Pie, PieChart, Cell, Sector } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { chartConfig } from '@/constants/piechart-config'
import { type PieSectorDataItem } from 'recharts/types/polar/Pie'
import { Label } from './ui/label'

interface Props {
  data: CategoryPercentage[] | null
  transactionType: 'expense' | 'income'
}

interface FormattedDataEntry {
  category: string
  slug: string
  count: number
  percentage: number
  fill: string
}

function formatPercentage(value: number): string {
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2)
  return `${formatted}%`
}

function BreakdownChart({ data, transactionType }: Props): React.JSX.Element {
  const formattedData = useMemo((): FormattedDataEntry[] | undefined => {
    if (!data || data.length === 0) return undefined
    return data.map(
      (d): FormattedDataEntry => ({
        category: d.category,
        slug: d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_'),
        count: d.category_count,
        percentage: parseFloat(String(d.percentage)),
        fill: `var(--color-${d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_')})`
      })
    )
  }, [data])

  const renderLegend = useMemo((): React.ReactNode => {
    if (!formattedData || formattedData.length === 0) return null
    return (
      <div className="shrink-0 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs px-2 pt-2 border-t translate-y-0.5">
        {formattedData.map((entry: FormattedDataEntry) => (
          <div key={entry.category} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="truncate max-w-20">
              {chartConfig[entry.slug]?.label || entry.category}
            </span>
            <span className="font-medium">{formatPercentage(entry.percentage)}</span>
          </div>
        ))}
      </div>
    )
  }, [formattedData])

  return (
    <Card className="flex flex-col w-full h-100 shadow-none overflow-hidden">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-lg font-semibold">
          {transactionType === 'expense' ? 'Expenses Breakdown' : 'Income Breakdown'}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 p-0 pb-3 -translate-y-3">
        {formattedData !== undefined && formattedData.length >= 1 ? (
          <>
            <div className="flex-1 min-h-0 w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip
                    cursor={true}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const item = payload[0]
                      const color = item.payload.fill
                      const label =
                        chartConfig[item.name as keyof typeof chartConfig]?.label || item.name
                      return (
                        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-muted-foreground">{label}</span>
                          </div>
                          <span className="font-medium tabular-nums">
                            {formatPercentage(Number(item.value))}
                          </span>
                        </div>
                      )
                    }}
                  />
                  <Pie
                    data={formattedData}
                    dataKey="percentage"
                    nameKey="slug"
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    innerRadius="0%"
                    paddingAngle={0}
                    label={({ percentage }) => (percentage > 5 ? formatPercentage(percentage) : '')}
                    labelLine={false}
                    activeIndex={0}
                    activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 0} />
                        <Sector
                          {...props}
                          outerRadius={outerRadius + 8}
                          innerRadius={outerRadius + 4}
                        />
                      </g>
                    )}
                  >
                    {formattedData.map((entry: FormattedDataEntry) => (
                      <Cell key={`cell-${entry.category}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            {renderLegend}
          </>
        ) : (
          <div className="flex flex-1 p-10 justify-center items-center">
            <Label className="opacity-50">No breakdown available.</Label>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BreakdownChart
