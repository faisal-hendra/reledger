import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SearchIcon, SaveIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { saveAs } from 'file-saver'
import { FILTER_CATEGORIES as CATEGORIES } from '@/constants/categories'

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

interface Props {
  children: React.ReactNode
  transactions: Transaction[]
  onFilterChange?: (filters: {
    month: number | null
    year: number | null
    keyword: string | null
    category: string | null
  }) => void
  onTransactionFiltered?: () => void
}
function FilterTransaction({
  children,
  transactions,
  onFilterChange,
  onTransactionFiltered
}: Props): React.JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [availableYears, setAvailableYears] = useState<{ value: number | null; label: string }[]>([
    { value: null, label: 'All Years' }
  ])

  const handleMonthChange = (value: string): void => {
    const monthValue = value === 'null' ? null : Number(value)
    setSelectedMonth(monthValue)
    onFilterChange?.({
      month: monthValue,
      year: selectedYear,
      keyword: searchTerm || null,
      category: selectedCategory || null
    })
  }

  const handleYearChange = (value: number | null): void => {
    setSelectedYear(value)
    onFilterChange?.({
      month: selectedMonth,
      year: value,
      keyword: searchTerm || null,
      category: selectedCategory || null
    })
  }

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value)
    onFilterChange?.({
      month: selectedMonth,
      year: selectedYear,
      keyword: value || null,
      category: selectedCategory || null
    })
  }

  const handleCategoryChange = (value: string | null): void => {
    const categoryValue = value === 'All Categories' ? null : value
    setSelectedCategory(categoryValue || '')
    onFilterChange?.({
      month: selectedMonth,
      year: selectedYear,
      keyword: searchTerm || null,
      category: categoryValue
    })
  }

  const handleCSVExport = (): void => {
    const csvContent = [
      ['Date', 'Name', 'Amount', 'Category', 'Type'],
      ...transactions.map((t) => [t.date, t.name, t.amount, t.category, t.transaction_type])
    ]
      .map((row) => row.join(','))
      .join('\n')
    handleCSVDownload(csvContent)
  }

  const handleCSVDownload = (csv: string): void => {
    const file = new File([csv], 'transactions.csv', { type: 'text/csv' })
    saveAs(file)
  }

  useEffect(() => {
    const fetchAvailableYears = async (): Promise<void> => {
      try {
        const data = await window.api.getAvailableYears()
        const yearsData = data.map((year) => ({ value: year?.year, label: year?.year.toString() }))
        setAvailableYears([{ value: null, label: 'All Years' }, ...yearsData])
      } catch (error) {
        console.log(error)
      }
    }
    fetchAvailableYears()
  }, [])

  useEffect(() => {
    onTransactionFiltered?.()
  }, [selectedMonth, selectedYear, searchTerm])

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={10}>
        <Label className="pb-2">By Name</Label>
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
        <div className="mt-4 flex grid-cols-2 gap-2 pt-4">
          <div>
            <Label className="pb-2">By Month</Label>
            <Select
              onValueChange={handleMonthChange}
              value={selectedMonth === null ? 'null' : selectedMonth.toString()}
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
              onValueChange={(value) => handleYearChange(value === 'null' ? null : Number(value))}
              value={selectedYear === null ? 'null' : selectedYear.toString()}
            >
              <SelectTrigger className="grow w-30.5">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem
                    key={year.value?.toString() || 'null'}
                    value={year.value?.toString() || 'null'}
                  >
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-4">
          <Label>Category</Label>
          <div className="pt-2">
            <Select
              value={selectedCategory || 'All Categories'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-4">
          <Label>Data</Label>
          <div className="flex w-full pt-2">
            <Button
              className="grow"
              variant="outline"
              onClick={() => {
                handleCSVExport()
              }}
            >
              <SaveIcon />
              Export CSV
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterTransaction
