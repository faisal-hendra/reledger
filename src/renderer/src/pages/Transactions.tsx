import { useColumns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { useState, useEffect, useCallback } from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { FunnelIcon, PlusIcon, FileSpreadsheetIcon } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { AddTransaction } from '@/components/AddTransaction'
import { toast } from 'sonner'
import FilterTransaction from '@/components/FilterTransaction'
import { SortingState } from '@tanstack/react-table'
import TableLoading from '@/components/TableLoading'
import TableEmpty from '@/components/TableEmpty'
import { handleCSVExport } from '@/modules/csv-export'

interface Props {
  platform: string
}

const INITIAL_FILTER = {
  month: null,
  year: null,
  keyword: null,
  transaction_type: null,
  category: null
}

const DEFAULT_PAGE_SIZE = 15

function Transactions({ platform }: Props): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTER)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFiltering, setIsFiltering] = useState<boolean>(false)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const [totalCount, setTotalCount] = useState(0)

  const loadTransactions = useCallback(async (): Promise<void> => {
    try {
      !isFiltering && setIsLoading(true)
      const offset = pagination.pageIndex * pagination.pageSize
      const sortColumn = sorting[0]?.id
      const sortDirection = sorting[0]?.desc ? 'desc' : 'asc'
      const data = await window.api.getTransactions({
        ...filters,
        limit: pagination.pageSize,
        offset,
        sortColumn,
        sortDirection
      })
      setTransactions(data.transactions)
      setTotalCount(data.total)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, pagination.pageIndex, pagination.pageSize, sorting, isFiltering])

  const displayToast = useCallback((message: string): void => {
    toast.success(message, { position: 'bottom-right' })
  }, [])

  useEffect(() => {
    const initializeTransactions = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions({
          ...filters,
          limit: pagination.pageSize,
          offset: 0
        })
        setTransactions(data.transactions)
        setTotalCount(data.total)
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      } catch (error) {
        console.error('Failed to initialize transactions:', error)
      }
    }

    initializeTransactions()
  }, [])

  useEffect(() => {
    const offset = pagination.pageIndex * pagination.pageSize
    const sortColumn = sorting[0]?.id
    const sortDirection = sorting[0]?.desc ? 'desc' : 'asc'
    const fetchData = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions({
          ...filters,
          limit: pagination.pageSize,
          offset,
          sortColumn,
          sortDirection
        })
        setTransactions(data.transactions)
        setTotalCount(data.total)
      } catch (error) {
        console.error('Failed to load transactions:', error)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [filters])

  const columns = useColumns(loadTransactions, displayToast)

  return (
    <>
      <PageHeader>
        <ButtonGroup>
          <FilterTransaction
            transactions={transactions}
            onFilterChange={setFilters}
            onTransactionFiltered={loadTransactions}
            setIsFiltering={setIsFiltering}
          >
            <Button variant="outline">
              <FunnelIcon />
            </Button>
          </FilterTransaction>
          {transactions.length === 0 ? (
            <Button variant="outline" disabled>
              <FileSpreadsheetIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                handleCSVExport(transactions)
              }}
            >
              <FileSpreadsheetIcon />
            </Button>
          )}
          <AddTransaction
            onTransactionAdded={loadTransactions}
            editMode={false}
            alert={displayToast}
          >
            <Button>
              <PlusIcon />
              Add
            </Button>
          </AddTransaction>
        </ButtonGroup>
      </PageHeader>
      <div
        className={`space-y-6 flex-1 overflow-auto p-4 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
      >
        {isLoading ? (
          <TableLoading />
        ) : transactions.length > 0 || totalCount > 0 ? (
          <DataTable
            columns={columns}
            data={transactions}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalCount={totalCount}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ) : (
          <TableEmpty />
        )}
      </div>
    </>
  )
}

export default Transactions
