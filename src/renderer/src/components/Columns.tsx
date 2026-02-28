'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from '@/components/ui/badge'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: number
  transaction_type: 'expense' | 'income'
  name: string
  amount: number
  category: string
  description?: string
  date: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'transaction_type',
    header: 'Type',
    cell: ({ row }) => {
      const type: string = row.getValue('transaction_type')
      const formatted: string = type.charAt(0).toUpperCase() + type.substring(1)
      return (
        <Badge
          className={
            type === 'income'
              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          }
          variant="outline"
        >
          {formatted}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const date: string = row.getValue('date')
      return <div className="px-3">{date}</div>
    }
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.getValue('description')
      if (desc) {
        return <div>{`${desc}`}</div>
      } else {
        return <div>-</div>
      }
    }
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className="flex grow justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className="text-right font-medium px-3">{formatted}</div>
    }
  }
]
