export {}

declare global {
  interface Transaction {
    id: number
    transaction_type: 'expense' | 'income'
    name: string
    amount: number
    category: string
    description?: string
    date: string
  }

  interface TransactionUpdate {
    transaction_type: 'expense' | 'income'
    name: string
    amount: number
    category: string
    description?: string
    date: string
    id: number
  }

  interface TransactionID {
    id: number
  }

  interface TransactionFilters {
    month: number | null
    year: number | null
    keyword: string | null
  }

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: any
  }

  interface MonthlyTotal {
    income: number
    expense: number
  }

  interface MonthlyTotalFilters {
    month: number
    year: number
  }
}
