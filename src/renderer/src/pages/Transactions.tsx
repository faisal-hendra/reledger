import { createColumns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { FunnelIcon, PlusIcon } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'

interface Props {
  platform: string
}

function Transctions({ platform }: Props): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const loadTransactions = async (): Promise<void> => {
    try {
      const filters = {
        month: null,
        year: null,
        keyword: null
      }
      const data = await window.api.getTransactions(filters)
      setTransactions(data)
    } catch {
      console.log('test')
    }
  }

  useEffect(() => {
    const initializeTransactions = async (): Promise<void> => {
      try {
        const filters = {
          month: null,
          year: null,
          keyword: null
        }
        const data = await window.api.getTransactions(filters)
        setTransactions(data)
      } catch {
        console.log('test')
      }
    }

    initializeTransactions()
  }, [])

  useEffect(() => {
    console.log('Transactions: ', transactions)
  }, [transactions])

  const buttonTest = (): void => {
    console.log('Hello World')
  }

  return (
    <>
      <PageHeader>
        <ButtonGroup>
          <Button variant="outline">
            <FunnelIcon />
            Filter
          </Button>
          <Button onClick={() => buttonTest()}>
            <PlusIcon />
            Add
          </Button>
        </ButtonGroup>
      </PageHeader>
      <div
        className={`space-y-6 flex-1 overflow-auto p-6 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
      >
        {transactions.length > 0 ? (
          <DataTable columns={createColumns(loadTransactions)} data={transactions} />
        ) : (
          <div className="w-full text-center opacity-70 text-sm">No data to display</div>
        )}
      </div>
    </>
  )
}

export default Transctions
