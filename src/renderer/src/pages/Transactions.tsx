import { columns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { useState, useEffect } from 'react'

type Transaction = {
  id: number
  transaction_type: 'expense' | 'income'
  name: string
  amount: number
  category: string
  description?: string
  date: string
}

function Transctions(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
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

    loadTransactions()
  }, [])

  useEffect(() => {
    console.log('Transactions: ', transactions)
  }, [transactions])

  return (
    <div>
      {transactions.length > 0 ? (
        <DataTable columns={columns} data={transactions} />
      ) : (
        <div className="w-full text-center opacity-70 text-sm">No data to display</div>
      )}
    </div>
  )
}

export default Transctions
