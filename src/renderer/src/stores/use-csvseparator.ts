import { create } from 'zustand'
import { CSV_SEPARATORS } from '@/constants/csv-separators'

const STORAGE_KEY = 'reledger-csv-separator'

function getInitialSeparator(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const found = CSV_SEPARATORS.find((s) => s === stored)
    if (found) return found
  }
  return CSV_SEPARATORS[0]
}

type CsvSeparatorState = {
  csvSeparator: string
  setCsvSeparator: (separator: string) => void
}

export const useCsvSeparator = create<CsvSeparatorState>()((set) => ({
  csvSeparator: getInitialSeparator(),
  setCsvSeparator: (separator: string) => {
    localStorage.setItem(STORAGE_KEY, separator)
    set({ csvSeparator: separator })
  }
}))