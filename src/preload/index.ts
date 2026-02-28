import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('getTransactions', filters),
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('addTransaction', transaction),
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('deleteTransaction', transactionId),
  updateTransaction: (transaction: TransactionUpdate) =>
    ipcRenderer.invoke('updateTransaction', transaction),
  getRecentTransaction: (limit: number) => ipcRenderer.invoke('getRecentTransaction', limit)
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

contextBridge.exposeInMainWorld('api', {
  api
})
