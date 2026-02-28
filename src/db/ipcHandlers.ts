import { ipcMain } from 'electron'
import AppDatabase from './database'

export default function setUpHandlers(db: AppDatabase): void {
  ipcMain.handle('getTransactions', (_, filters) => {
    return db.getTransactions(filters)
  })

  ipcMain.handle('addTransaction', (_, transaction) => {
    return db.addTransaction(transaction)
  })

  ipcMain.handle('deleteTransaction', (_, transactionId) => {
    return db.deleteTransaction(transactionId)
  })

  ipcMain.handle('updateTransaction', (_, transaction) => {
    return db.updateTransaction(transaction)
  })
  ipcMain.handle('getRecentTransactions', (_, limit) => {
    return db.getRecentTransactions(limit)
  })
}
