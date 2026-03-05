import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import dayjs from 'dayjs'

const MONTHS = [
  { value: null, label: 'All Months' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

const YEAR = dayjs().year()

interface Props {
  children: React.ReactNode
  onFilterChange?: (filters: {
    month: number | null
    year: number | null
    keyword: string | null
  }) => void
  onTransactionFiltered?: () => void
}
function FilterMenu({ children, onFilterChange, onTransactionFiltered }: Props): React.JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState(YEAR)
  const [searchTerm, setSearchTerm] = useState('')

  const handleMonthChange = (value: string): void => {
    const monthValue = value === 'null' ? null : Number(value)
    setSelectedMonth(monthValue)
    onFilterChange?.({ month: monthValue, year: selectedYear, keyword: searchTerm || null })
  }

  const handleYearChange = (value: number): void => {
    setSelectedYear(value)
    onFilterChange?.({ month: selectedMonth, year: value, keyword: searchTerm || null })
  }

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value)
    onFilterChange?.({ month: selectedMonth, year: selectedYear, keyword: value || null })
  }

  useEffect(() => {
    onTransactionFiltered?.()
  }, [selectedMonth, selectedYear, searchTerm])

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Label className="pt-2 pb-2">By Name</Label>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon>
            <InputGroupInput
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </InputGroupAddon>
        </InputGroup>
        <br></br>
        <div className="flex grid-cols-2 gap-2">
          <div>
            <Label className="pb-2">By Month</Label>
            <Select
              onValueChange={handleMonthChange}
              value={selectedMonth === null ? 'null' : selectedMonth.toString()}
            >
              <SelectTrigger className="w-30">
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
            <Input
              type="number"
              value={selectedYear}
              onChange={(e) => {
                handleYearChange(Number(e.target.value))
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterMenu
