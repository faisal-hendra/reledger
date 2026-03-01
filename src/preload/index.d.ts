import { ElectronAPI } from '@electron-toolkit/preload'
import { Transaction, TransactionUpdate, TransactionFilters } from '../db/database'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getTransactions: (filters: TransactionFilters) => Promise<Transaction[]>
      addTransaction: (transaction: Transaction) => Promise<void>
      deleteTransaction: (transactionId: string) => Promise<void>
      updateTransaction: (transaction: TransactionUpdate) => Promise<void>
      getRecentTransactions: (limit: number) => Promise<void>
      getMonthlyTotal: (filters: MonthlyTotalFilters) => Promise<void>
    }
  }
}
