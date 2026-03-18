import { useColumns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { FunnelIcon, PlusIcon, FileSpreadsheetIcon, Table2Icon } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { AddTransaction } from '@/components/AddTransaction'
import { toast } from 'sonner'
import FilterTransaction from '@/components/FilterTransaction'
import { saveAs } from 'file-saver'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { SortingState } from '@tanstack/react-table'

interface Props {
  platform: string
}

const INITIAL_FILTER = {
  month: null,
  year: null,
  keyword: null,
  category: null
}

const DEFAULT_PAGE_SIZE = 15

function Transactions({ platform }: Props): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTER)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFiltering, setIsfiltering] = useState<boolean>(false)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const [totalCount, setTotalCount] = useState(0)

  const loadTransactions = async (): Promise<void> => {
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
  }

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

  const displayToast = (message: string): void => {
    toast.success(message, { position: 'bottom-right' })
  }

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

  const NoData = (): React.ReactNode => {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table2Icon />
          </EmptyMedia>
          <EmptyDescription>
            No transactions found for the selected period or category. To get started, click the Add
            button in the top-right corner.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2"></EmptyContent>
      </Empty>
    )
  }

  const RenderDataTable = (): React.ReactNode => {
    const columns = useColumns(loadTransactions, displayToast)
    return (
      <div>
        {transactions.length > 0 || totalCount > 0 ? (
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
          <NoData />
        )}
      </div>
    )
  }

  const RenderSpinner = (): React.ReactNode => {
    return (
      <div>
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Processing your table</EmptyTitle>
            <EmptyDescription>
              Please wait while we process your transactions history.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <>
      <PageHeader>
        <ButtonGroup>
          <FilterTransaction
            transactions={transactions}
            onFilterChange={setFilters}
            onTransactionFiltered={loadTransactions}
            setIsFiltering={setIsfiltering}
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
                handleCSVExport()
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
        {!isLoading ? <RenderDataTable /> : <RenderSpinner />}
      </div>
    </>
  )
}

export default Transactions
