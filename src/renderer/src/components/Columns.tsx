'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, CopyIcon, PenIcon, TrashIcon } from 'lucide-react'
import DeleteTransaction from './DeleteTransaction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AddTransaction } from './AddTransaction'
import dayjs from 'dayjs'

export const createColumns = (
  onRefresh?: () => void,
  displayToast?: (message: string) => void
): ColumnDef<Transaction, unknown>[] => [
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
      return <div className="px-3">{dayjs(date).format('DD MMMM YYYY')}</div>
    }
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'category',
    header: 'Category'
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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original

      const getTransactionsInfo = (): string => {
        return (
          `id: ${transaction.id}\n` +
          `type: ${transaction.transaction_type}\n` +
          `date: ${transaction.date}\n` +
          `name: ${transaction.name}\n` +
          `cat: ${transaction.category}\n` +
          `desc: ${transaction.description}\n` +
          `amount: $${transaction.amount}\n`
        )
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(getTransactionsInfo())}>
              <CopyIcon />
              Copy
            </DropdownMenuItem>
            <AddTransaction
              onTransactionAdded={() => {
                onRefresh?.()
              }}
              editMode={true}
              idToEdit={transaction.id}
              alert={() => displayToast?.('Transaction edited successfully')}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PenIcon />
                Edit
              </DropdownMenuItem>
            </AddTransaction>
            <DropdownMenuSeparator />
            <DeleteTransaction
              id={transaction.id?.toString() || ''}
              onRefresh={onRefresh}
              alert={() => displayToast?.('Transaction deleted successfuly')}
            >
              <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DeleteTransaction>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
