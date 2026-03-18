import { ElectronAPI } from '@electron-toolkit/preload'
import { TransactionFilters } from '../db/database'
import type { MonthlyTotal, MonthlyTotalFilters } from '../types/global'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      platform: string
      dimTitlebar: (isDimmed: boolean, theme: 'light' | 'dark') => void
      setTitlebarTheme: (theme: 'light' | 'dark') => void
      getTransactions: (
        filters: TransactionFilters
      ) => Promise<{ transactions: Transaction[]; total: number }>
      addTransaction: (transaction: Transaction) => Promise<void>
      deleteTransaction: (transactionId: string) => Promise<void>
      updateTransaction: (transaction: Transaction) => Promise<void>
      getRecentTransactions: (limit: number) => Promise<Transaction[] | null>
      getMonthlyTotal: (filters: MonthlyTotalFilters) => Promise<MonthlyTotal | null>
      getTransactionById: (id: number) => Promise<Transaction | null>
      getFullMonthlyTotal: (
        year: number
      ) => Promise<{ month: number; income: number; expense: number }[] | undefined>
      getAvailableYears: () => Promise<GetYear[] | null>
      getCategoryPercentage: (
        filters: CategoryPerecentageFilters
      ) => Promise<CategoryPercentage[] | null>
      resetTable: () => Promise<void>
    }
  }
}

export type { Transaction, TransactionFilters, MonthlyTotal, MonthlyTotalFilters }
