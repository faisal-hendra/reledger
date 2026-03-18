'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState
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
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  totalCount: number
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  totalCount,
  sorting,
  onSortingChange
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [selectedRowCount, setSelectedRowCount] = React.useState<string>('15')
  const isInitialized = React.useRef(false)

  const pageCount = Math.ceil(totalCount / pagination.pageSize)

  React.useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      if (pagination.pageSize === 15) {
        setSelectedRowCount('15')
      } else if (pagination.pageSize === 25) {
        setSelectedRowCount('25')
      } else if (pagination.pageSize === 50) {
        setSelectedRowCount('50')
      } else if (totalCount > 0 && pagination.pageSize >= totalCount) {
        setSelectedRowCount('all-rows')
      }
    }
  }, [pagination.pageSize, totalCount])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    state: {
      pagination,
      sorting
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      onPaginationChange(newPagination)
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(newSorting)
    },
    manualPagination: true,
    manualSorting: true
  })

  const handleRowCountChange = (value: string): void => {
    setSelectedRowCount(value)
    const newSize = value === 'all-rows' ? totalCount : Number(value)
    onPaginationChange({ pageIndex: 0, pageSize: newSize })
  }

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
          {totalCount > 0
            ? `${pagination.pageIndex * pagination.pageSize + 1}-${Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                totalCount
              )} of ${totalCount} records`
            : 'No records'}
        </Label>
        <div className="flex gap-2">
          <Select value={selectedRowCount} onValueChange={handleRowCountChange}>
            <SelectTrigger className="w-26" size="sm">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="15">15 Rows</SelectItem>
                <SelectItem value="25">25 Rows</SelectItem>
                <SelectItem value="50">50 Rows</SelectItem>
                <SelectItem value="all-rows">All Rows</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex - 1 })
              }
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex + 1 })
              }
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
