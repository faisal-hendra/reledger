import React, { useMemo } from 'react'
import { Pie, PieChart, Cell, Sector } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
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

function BreakdownChart({ data, transactionType }: Props): React.JSX.Element {
  const formattedData = useMemo((): FormattedDataEntry[] | undefined => {
    if (!data || data.length === 0) return undefined
    return data.map(
      (d): FormattedDataEntry => ({
        category: d.category,
        slug: d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_'), // normalize category name for CSS variable keys
        count: d.category_count,
        percentage: parseFloat(String(d.percentage)),
        fill: `var(--color-${d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_')})` // maps category to dynamic theme colors
      })
    )
  }, [data])

  const renderLegend = useMemo((): React.ReactNode => {
    if (!formattedData || formattedData.length === 0) return null
    return (
      <div className="shrink-0 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs px-2 pt-2 border-t">
        {formattedData.map((entry: FormattedDataEntry, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="truncate max-w-20">
              {chartConfig[entry.slug]?.label || entry.category}
            </span>
            <span className="font-medium">{entry.percentage.toFixed(2)}%</span>
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

      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 p-0 pb-3">
        {formattedData !== undefined && formattedData.length >= 1 ? (
          <>
            <div className="flex-1 min-h-0 w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                  <Pie
                    className="-translate-y-1.5"
                    data={formattedData}
                    dataKey="percentage"
                    nameKey="slug"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="0%" // creates donut chart
                    paddingAngle={0} // adds spacing between segments
                    label={({ percentage }) => (percentage > 5 ? `${percentage.toFixed(2)}%` : '')} // only show labels for segments > 5% to avoid overlap
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
                    {formattedData.map((entry: FormattedDataEntry, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
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
