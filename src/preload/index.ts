import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Transaction, TransactionUpdate, TransactionFilters } from '../db/database'

// Custom APIs for renderer
const api = {
  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('get-transactions', filters),
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('add-transaction', transaction),
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('delete-transaction', transactionId),
  updateTransaction: (transaction: TransactionUpdate) =>
    ipcRenderer.invoke('update-transaction', transaction)
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
