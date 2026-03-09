import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon, CalendarIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { CATEGORIES } from '@/constants/categories'

import dayjs from 'dayjs'

interface Props {
  children: React.ReactNode
  onTransactionAdded: () => void
  alert: (message: string) => void
  editMode: boolean
  idToEdit?: number
}

const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' }
]

const INITIAL_FORM = {
  transaction_type: 'expense',
  date: dayjs().format('YYYY-MM-DD'),
  name: '',
  amount: '',
  category: '',
  description: ''
}

export function AddTransaction({
  children,
  onTransactionAdded,
  editMode,
  idToEdit,
  alert
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)

  const set = (field: string) => (value: string | React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value.target.value
    }))

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      await window.api.addTransaction({
        transaction_type: formData.transaction_type as 'expense' | 'income',
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      })
      setFormData(INITIAL_FORM)
      setOpen(false)
      onTransactionAdded?.()
      alert?.('Transaction added successfully')
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }

  const handleEdit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      await window.api.updateTransaction({
        id: idToEdit,
        transaction_type: formData.transaction_type as 'expense' | 'income',
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      })
      setFormData(INITIAL_FORM)
      setOpen(false)
      onTransactionAdded?.()
      alert?.('Transaction edited successfully')
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch data if in edit mode
  useEffect(() => {
    if (idToEdit) {
      const fetchDataToEdit = async (): Promise<void> => {
        try {
          if (idToEdit === undefined) {
            console.error('idToEdit is not available')
            return
          }
          const dataToEdit = await window.api.getTransactionById(idToEdit)
          const FETCHED_DATA = {
            transaction_type: dataToEdit?.transaction_type || 'expense',
            date: dataToEdit?.date || dayjs().format('YYYY-MM-DD'),
            name: dataToEdit?.name || '',
            amount: dataToEdit?.amount?.toString() || '',
            category: dataToEdit?.category || '',
            description: dataToEdit?.description || ''
          }
          if (dataToEdit) {
            setFormData(FETCHED_DATA)
          }
        } catch (error) {
          console.error('Failed to fetch transaction to update: ', error)
        }
      }
      fetchDataToEdit()
    }
  }, [idToEdit])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        window.api.dimTitlebar(isOpen)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={!editMode ? handleSubmit : handleEdit}>
          <DialogHeader>
            <DialogTitle>{!editMode ? 'Add transaction' : 'Edit transaction'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-start gap-4">
            {/* Left column */}
            <FieldGroup>
              <Field className="pt-4">
                <Label htmlFor="transaction_type">Type</Label>
                <Select
                  value={formData.transaction_type}
                  onValueChange={(value) => set('transaction_type')(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
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
              </Field>

              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={set('name')}
                  placeholder="e.g. Grocery, Salary, Rent"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  placeholder="Enter amount"
                  onChange={set('amount')}
                  required
                />
              </Field>
            </FieldGroup>

            {/* Right column */}
            <FieldGroup>
              <Field className="pt-4">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => set('category')(value)}>
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
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={set('description')}
                  placeholder="Optional description"
                />
              </Field>
              <Field>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!formData.date}
                      className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                    >
                      <div className="flex gap-2 items-center">
                        <CalendarIcon className="opacity-30" />
                        {formData.date ? (
                          dayjs(formData.date).format('DD MMMM YYYY')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </div>
                      <ChevronDownIcon className="h-4 w-4 opacity-30" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={(date) => {
                        setFormData({
                          ...formData,
                          date: date ? dayjs(date).format('YYYY-MM-DD') : ''
                        })
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </FieldGroup>
          </div>
          <div className="pt-4">
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
