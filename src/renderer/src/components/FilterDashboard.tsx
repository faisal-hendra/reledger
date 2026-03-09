import React from 'react'
import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChartBarIcon, DatabaseIcon, RefreshCwIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import dayjs from 'dayjs'
import { Button } from './ui/button'
import { MONTHS } from '@/constants/months'

interface Props {
  children: React.ReactNode
  displayIncomeChart: boolean
  setDisplayIncomeChart: (value: boolean) => void
  displayExpenseChart: boolean
  setDisplayExpenseChart: (value: boolean) => void
  year: number
  setYear: (value: number) => void
  month: number
  setMonth: (value: number) => void
}

function FilterDashboard({
  children,
  displayIncomeChart,
  setDisplayIncomeChart,
  displayExpenseChart,
  setDisplayExpenseChart,
  year,
  setYear,
  month,
  setMonth
}: Props): React.JSX.Element {
  const [availableYears, setAvailableYears] = useState<number[]>([dayjs().year()])

  useEffect(() => {
    const fetchAvailableYears = async (): Promise<void> => {
      try {
        const data = await window.api.getAvailableYears()
        const yearsData = data.filter((year) => year?.year !== dayjs().year())
        const yearsArray = yearsData.map((year) => year?.year)
        setAvailableYears([...availableYears, ...yearsArray])
      } catch (error) {
        console.log(error)
      }
    }
    fetchAvailableYears()
  }, [])

  const handleReset = (): void => {
    setMonth(dayjs().month() + 1)
    setYear(dayjs().year())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={10}>
        <div>
          <div className="flex items-center gap-2 text-muted-foreground pb-2 justify-between">
            <div className="flex gap-2">
              <DatabaseIcon className="w-4 h-4" />
              <Label>Database</Label>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                handleReset()
              }}
            >
              <RefreshCwIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div>
              <Label className="pb-2">By Month</Label>
              <Select
                value={month.toString()}
                onValueChange={(e) => {
                  setMonth(Number(e))
                }}
              >
                <SelectTrigger className="w-30.5">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem
                      key={month.value?.toString() || 'null'}
                      value={month.value?.toString() || 'null'}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="pb-2">By Year</Label>
              <Select
                onValueChange={(value) => {
                  setYear(Number(value))
                }}
                value={year.toString()}
              >
                <SelectTrigger className="grow w-30.5">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-2 text-muted-foreground pb-2">
            <ChartBarIcon className="w-4 h-4" />
            <Label>Chart</Label>
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Income</Label>
              <Switch
                checked={displayIncomeChart}
                onCheckedChange={() => setDisplayIncomeChart(!displayIncomeChart)}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm text-muted-foreground">Expense</Label>
              <Switch
                checked={displayExpenseChart}
                onCheckedChange={() => setDisplayExpenseChart(!displayExpenseChart)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterDashboard
