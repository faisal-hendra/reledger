import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  platform: process.platform, // 'win32' | 'darwin' | 'linux'
  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('getTransactions', filters),
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('addTransaction', transaction),
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('deleteTransaction', transactionId),
  updateTransaction: (transaction: TransactionUpdate) =>
    ipcRenderer.invoke('updateTransaction', transaction),
  getRecentTransactions: (limit: number) => ipcRenderer.invoke('getRecentTransactions', limit)
}

// Get oprating system name

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

contextBridge.exposeInMainWorld('api', {
  api
})
