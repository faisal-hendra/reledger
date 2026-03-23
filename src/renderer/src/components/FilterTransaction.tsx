import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SearchIcon, RefreshCwIcon, FunnelIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories'
import { TRANSACTION_MONTHS as MONTHS } from '@/constants/months'
import { TRANSACTION_TYPES } from '@/constants/transaction-types'
import { Badge } from './ui/badge'

interface Props {
  children: React.ReactNode
  transactions: Transaction[]
  onFilterChange?: (filters: {
    month: number | null
    year: number | null
    keyword: string | null
    category: string | null
    transaction_type: 'income' | 'expense' | null
  }) => void
  onTransactionFiltered?: () => void
  setIsFiltering: (value: boolean) => void
}
function FilterTransaction({
  children,
  onFilterChange,
  onTransactionFiltered,
  setIsFiltering
}: Props): React.JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All')
  const [availableYears, setAvailableYears] = useState<{ value: number | null; label: string }[]>([
    { value: null, label: 'All Years' }
  ])

  // Change list of category option according to transaction type
  const [listCategories, setListCategories] = useState<string[]>(['All'])

  useEffect(() => {
    const determineCategoryList = (): void => {
      if (selectedType === null) {
        const incomeNoOther = INCOME_CATEGORIES.filter((val) => val !== 'Other')
        setListCategories(['All', ...incomeNoOther, ...EXPENSE_CATEGORIES])
      } else if (selectedType === 'expense') {
        setListCategories(['All', ...EXPENSE_CATEGORIES])
      } else {
        setListCategories(['All', ...INCOME_CATEGORIES])
      }
    }
    determineCategoryList()
  }, [selectedType])

  const handleMonthChange = (value: string): void => {
    const monthValue = value === 'null' ? null : Number(value)
    setSelectedMonth(monthValue)
    onFilterChange?.({
      month: monthValue,
      year: selectedYear,
      keyword: searchTerm || null,
      transaction_type: selectedType || null,
      category: selectedCategory === 'All' || selectedCategory === null ? null : selectedCategory
    })
  }

  const handleYearChange = (value: number | null): void => {
    setSelectedYear(value)
    onFilterChange?.({
      month: selectedMonth,
      year: value,
      keyword: searchTerm || null,
      transaction_type: selectedType || null,
      category: selectedCategory === 'All' || selectedCategory === null ? null : selectedCategory
    })
  }

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value)
    onFilterChange?.({
      month: selectedMonth,
      year: selectedYear,
      keyword: value || null,
      transaction_type: selectedType || null,
      category: selectedCategory === 'All' || selectedCategory === null ? null : selectedCategory
    })
  }

  const handleTypeChange = (val: 'income' | 'expense' | 'all'): void => {
    const newType = val === 'all' ? null : val
    setSelectedType(newType)

    // Reset category if it's not applicable to the new type
    let newCategory = selectedCategory
    if (selectedCategory && selectedCategory !== 'All') {
      const isValidForNewType =
        newType === null ||
        (newType === 'expense' &&
          EXPENSE_CATEGORIES.includes(selectedCategory as (typeof EXPENSE_CATEGORIES)[number])) ||
        (newType === 'income' &&
          INCOME_CATEGORIES.includes(selectedCategory as (typeof INCOME_CATEGORIES)[number]))

      if (!isValidForNewType) {
        newCategory = 'All'
        setSelectedCategory('All')
      }
    }

    onFilterChange?.({
      month: selectedMonth,
      year: selectedYear,
      keyword: searchTerm || null,
      transaction_type: newType,
      category: newCategory === 'All' || newCategory === null ? null : newCategory
    })
  }

  const handleCategoryChange = (value: string): void => {
    const categoryValue = value === 'All' ? null : value
    setSelectedCategory(categoryValue === 'All' || categoryValue === null ? 'All' : categoryValue)
    onFilterChange?.({
      month: selectedMonth,
      year: selectedYear,
      keyword: searchTerm || null,
      transaction_type: selectedType || null,
      category: categoryValue === 'All' || categoryValue === null ? null : categoryValue
    })
  }

  useEffect(() => {
    const fetchAvailableYears = async (): Promise<void> => {
      try {
        const data = await window.api.getAvailableYears()
        const yearsData = data.map((year) => ({ value: year?.year, label: year?.year.toString() }))
        setAvailableYears([{ value: null, label: 'All Years' }, ...yearsData])
      } catch (error) {
        console.error('Failed to fetch available years:', error)
      }
    }
    fetchAvailableYears()
  }, [])

  // Trigger filter callback whenever any filter criteria changes
  useEffect(() => {
    onTransactionFiltered?.()
    setIsFiltering(true)
  }, [
    selectedMonth,
    selectedYear,
    searchTerm,
    selectedType,
    selectedCategory,
    onTransactionFiltered,
    setIsFiltering
  ])

  const handleReset = (): void => {
    setSelectedMonth(null)
    setSelectedYear(null)
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedType(null)
    onFilterChange?.({
      month: null,
      year: null,
      keyword: null,
      transaction_type: null,
      category: null
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={10}>
        <div className="flex justify-between items-center opacity-50 pb-2">
          <div className="flex gap-2 items-center">
            <FunnelIcon className="h-4 w-4" />
            <Label>Filter Transactions</Label>
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
        <div>
          <Label className="pb-2 pt-4">Type</Label>
          <div className="flex w-full">
            <Select onValueChange={handleTypeChange} value={selectedType || 'all'}>
              <SelectTrigger className="grow w-30.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={'all'} value={'all'}>
                  <Badge
                    className="bg-gray-50 text-gray-300 dark:bg-gray-950 dark:text-gray-300"
                    variant="outline"
                  >
                    All
                  </Badge>
                </SelectItem>
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
        <div className="pt-4">
          <Label>Category</Label>
          <div className="pt-2">
            <Select
              value={
                selectedCategory === 'All' || selectedCategory === null ? 'All' : selectedCategory
              }
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {listCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterTransaction
