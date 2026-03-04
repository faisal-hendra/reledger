'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'

import { ButtonGroup } from '@/components/ui/button-group'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Label } from '@/components/ui/label'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 15
  })
  const [rowCountOption, setRowCountOption] = React.useState<string>('10')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination
    }
  })

  React.useEffect(() => {
    setPagination({ ...pagination, pageSize: Number(rowCountOption) })
  }, [rowCountOption])

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between space-x-2 py-4 gap-2 items-center">
        <Label className="text-xs opacity-70">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Label>
        <div className="flex gap-2">
          <Select
            value={rowCountOption}
            onValueChange={(e) => {
              setRowCountOption(e)
              setPagination({ ...pagination, pageIndex: 0 })
            }}
          >
            <SelectTrigger className="w-26" size="sm">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10 Rows</SelectItem>
                <SelectItem value="25">25 Rows</SelectItem>
                <SelectItem value="50">50 Rows</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}
