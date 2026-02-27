import { ipcMain } from 'electron'
import AppDatabase from './database'

export default function setUpHandlers(db: AppDatabase): void {
  ipcMain.handle('get-transactions', (_, filters) => {
    return db.getAllTransactions(filters)
  })

  ipcMain.handle('add-transaction', (_, transaction) => {
    return db.addTransaction(transaction)
  })

  ipcMain.handle('delete-transaction', (_, transactionId) => {
    return db.deleteTransaction(transactionId)
  })

  ipcMain.handle('update-transaction', (_, transaction) => {
    return db.updateTransaction(transaction)
  })
}
