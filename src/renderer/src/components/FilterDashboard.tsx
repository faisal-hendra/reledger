import React from 'react'
import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChartBarIcon, ArrowUpDownIcon, PieChartIcon, CalendarSyncIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from './ui/badge'
import dayjs from 'dayjs'
import { Button } from './ui/button'
import { MONTHS } from '@/constants/months'
import { Separator } from './ui/separator'
import { TRANSACTION_TYPES } from '@/constants/transaction-types'

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
  transactionType: 'income' | 'expense'
  setTransactionType: (value: 'income' | 'expense') => void
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
  setMonth,
  transactionType,
  setTransactionType
}: Props): React.JSX.Element {
  const [availableYears, setAvailableYears] = useState<number[]>([dayjs().year()])

  // Fetch years that have transaction data, excluding current year (added separately)
  useEffect(() => {
    const fetchAvailableYears = async (): Promise<void> => {
      try {
        const data = await window.api.getAvailableYears()
        const yearsData = data.filter((year) => year?.year !== dayjs().year())
        const yearsArray = yearsData.map((year) => year?.year)
        setAvailableYears([...availableYears, ...yearsArray])
      } catch (error) {
        console.error('Failed to fetch available years:', error)
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
              <ArrowUpDownIcon className="w-4 h-4" />
              <Label>Account</Label>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                handleReset()
              }}
            >
              <CalendarSyncIcon className="w-4 h-4" />
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

        <div className="pt-6">
          <Separator />
          <div className="pt-2 flex items-center gap-2 text-muted-foreground pb-2">
            <ChartBarIcon className="w-4 h-4" />
            <Label>Trend</Label>
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

        <div className="pt-6">
          <Separator />
          <div className="flex grid grid-rows-2 items-center gap-2 text-muted-foreground pb-2">
            <div className="flex gap-2">
              <PieChartIcon className="w-4 h-4" />
              <Label>Breakdown</Label>
            </div>
            <div className="flex">
              <Select
                onValueChange={(val: 'income' | 'expense') => setTransactionType(val)}
                value={transactionType}
              >
                <SelectTrigger className="grow w-30.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <Badge
                        className={
                          type.value === 'income'
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }
                        variant="outline"
                      >
                        {type.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterDashboard
