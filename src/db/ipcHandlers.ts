import { ipcMain } from 'electron'
import AppDatabase from './database'

export default function setUpHandlers(db: AppDatabase): void {
  ipcMain.handle('getTransactions', async (_, filters) => {
    try {
      return await db.getTransactions(filters)
    } catch (error) {
      console.error('IPC getTransactions error:', error)
      throw error
    }
  })

  ipcMain.handle('addTransaction', async (_, transaction) => {
    try {
      return await db.addTransaction(transaction)
    } catch (error) {
      console.error('IPC addTransaction error:', error)
      throw error
    }
  })

  ipcMain.handle('deleteTransaction', async (_, transactionId) => {
    try {
      return await db.deleteTransaction(transactionId)
    } catch (error) {
      console.error('IPC deleteTransaction error:', error)
      throw error
    }
  })

  ipcMain.handle('updateTransaction', async (_, transaction) => {
    try {
      return await db.updateTransaction(transaction)
    } catch (error) {
      console.error('IPC updateTransaction error:', error)
      throw error
    }
  })

  ipcMain.handle('getRecentTransactions', async (_, limit) => {
    try {
      return await db.getRecentTransactions(limit)
    } catch (error) {
      console.error('IPC getRecentTransactions error:', error)
      throw error
    }
  })

  ipcMain.handle('getMonthlyTotal', async (_, filters) => {
    try {
      return await db.getMonthlyTotal(filters)
    } catch (error) {
      console.error('IPC getMonthlyTotal error:', error)
      throw error
    }
  })

  ipcMain.handle('getTransactionById', async (_, id) => {
    try {
      return await db.getTransactionById(id)
    } catch (error) {
      console.error('IPC getTransactionById error:', error)
      throw error
    }
  })

  ipcMain.handle('getFullMonthlyTotal', async (_, year) => {
    try {
      return await db.getFullMonthlyTotal(year)
    } catch (error) {
      console.error('IPC getFullMonthlyTotal error:', error)
      throw error
    }
  })

  ipcMain.handle('getAvailableYears', async () => {
    try {
      return await db.getAvailableYears()
    } catch (error) {
      console.error('IPC getAvailableYears error:', error)
      throw error
    }
  })
}
