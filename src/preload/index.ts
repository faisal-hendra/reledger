import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Get oprating system name
  platform: process.platform, // 'win32' | 'darwin' | 'linux'

  // Controlbox dimming on windows
  dimTitlebar: (isDimmed) => ipcRenderer.send('dim-titlebar', isDimmed),

  // Databse operations
  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('getTransactions', filters),
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('addTransaction', transaction),
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('deleteTransaction', transactionId),
  updateTransaction: (transaction: Transaction) =>
    ipcRenderer.invoke('updateTransaction', transaction),
  getRecentTransactions: (limit: number) => ipcRenderer.invoke('getRecentTransactions', limit),
  getMonthlyTotal: (filters: MonthlyTotalFilters) => ipcRenderer.invoke('getMonthlyTotal', filters),
  getTransactionById: (id: number) => ipcRenderer.invoke('getTransactionById', id),
  getFullMonthlyTotal: (year: number) => ipcRenderer.invoke('getFullMonthlyTotal', year),
  getAvailableYears: () => ipcRenderer.invoke('getAvailableYears'),
  getCategoryPercentage: (filters: CategoryPerecentageFilters) =>
    ipcRenderer.invoke('getCategoryPercentage', filters)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
