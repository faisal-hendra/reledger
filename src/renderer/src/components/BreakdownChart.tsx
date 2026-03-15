import React, { useEffect, useState } from 'react'
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { chartConfig } from '@/constants/piechart-config'

interface Props {
  data: CategoryPercentage[] | null
}

function BreakdownChart({ data }: Props): React.JSX.Element {
  const [formattedData, setFormattedData] = useState<object[] | undefined>([])

  function toFixedIfNecessary(value, dp): number {
    return +parseFloat(value).toFixed(dp)
  }

  useEffect(() => {
    const formatData = (): void => {
      const formatted =
        data?.map((d) => ({
          category: d.category,
          slug: d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_'),
          count: d.category_count,
          percentage: toFixedIfNecessary(d.percentage, 2),
          fill: `var(--color-${d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_')})`
        })) || undefined
      setFormattedData(formatted)
    }
    formatData()
  }, [data])

  const renderLegend = () => {
    if (!formattedData || formattedData.length === 0) return null

    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2 px-2 pt-2 border-t">
        {formattedData.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: entry.fill.startsWith('var') ? entry.fill : entry.fill }}
            />
            <span className="truncate max-w-[100px]">
              {chartConfig[entry.slug]?.label || entry.category}
            </span>
            <span className="font-medium">{entry.percentage}%</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 min-h-[200px]">
          <ChartContainer
            config={chartConfig}
            className="w-full h-full aspect-square max-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                <Pie
                  data={formattedData}
                  dataKey="percentage"
                  nameKey="slug"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  innerRadius="45%"
                  paddingAngle={2}
                  label={({ percentage }) => (percentage > 5 ? `${percentage}%` : '')}
                  labelLine={false}
                >
                  {formattedData?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill.startsWith('var') ? entry.fill : entry.fill}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        {renderLegend()}
      </CardContent>
    </Card>
  )
}

export default BreakdownChart
