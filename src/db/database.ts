import { app } from 'electron'
import path from 'node:path'
import Database from 'better-sqlite3'

export interface Transaction {
  id: number
  transaction_type: 'expense' | 'income'
  name: string
  amount: number
  category: string
  description?: string
  date: string
}

export interface TransactionUpdate {
  transaction_type: 'expense' | 'income'
  name: string
  amount: number
  category: string
  description?: string
  date: string
  id: number
}

export interface TransactionID {
  id: number
}

export interface TransactionFilters {
  month: number | null
  year: number | null
  keyword: string | null
}

class AppDatabase {
  db: Database.Database

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'reledger.sqlite')
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.setUpDataBase()
  }

  setUpDataBase(): void {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          transaction_type TEXT NOT NULL CHECK(transaction_type IN ('expense', 'income')),
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `)
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Database setup failed:', error)
      throw error
    }
  }

  addTransaction(transaction: Transaction): void {
    try {
      const stmt = this.db.prepare(`
      INSERT INTO transactions (transaction_type, name, amount, category, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      stmt.run(
        transaction.transaction_type,
        transaction.name,
        transaction.amount,
        transaction.category,
        transaction.description,
        transaction.date
      )
    } catch (error) {
      console.error('Failed to add transaction:', error)
      throw error
    }
  }

  updateTransaction(transaction: TransactionUpdate): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE transactions SET transaction_type = ?, name = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ?
      `)
      stmt.run(
        transaction.transaction_type,
        transaction.name,
        transaction.amount,
        transaction.category,
        transaction.description,
        transaction.date,
        transaction.id
      )
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  }

  deleteTransaction(TransactionID: TransactionID): void {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM transactions WHERE id = ?
      `)
      stmt.run(TransactionID.id)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  }

  getAllTransactions(filters: TransactionFilters): Transaction[] {
    try {
      let query = 'SELECT * FROM transactions WHERE 1=1'
      const params: (string | number)[] = []

      if (filters.month) {
        query += " AND strftime('%m', date) = ?"
        params.push(filters.month.toString().padStart(2, '0'))
      }
      if (filters.year) {
        query += " AND strftime('%Y', date) = ?"
        params.push(filters.year.toString())
      }
      if (filters.keyword) {
        query += ' AND name LIKE ?'
        params.push(`%${filters.keyword}%`)
      }

      const stmt = this.db.prepare(query)
      console.log('Transactions From db: ', stmt.all(...params))
      console.log('Query: ', query)
      console.log('Parameters: ', params)
      return stmt.all(...params) as Transaction[]
    } catch (error) {
      console.error('Failed to get all transactions:', error)

      throw error
    }
  }

  getTransactionById(TransactionID: TransactionID): Transaction | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM transactions WHERE id = ?
      `)
      return stmt.get(TransactionID.id) as Transaction | null
    } catch (error) {
      console.error('Failed to get transaction by id:', error)
      throw error
    }
  }

  close(): void {
    try {
      this.db.close()
    } catch (error) {
      console.log('Failed to close the database: ', error)
    }
  }
}

export default AppDatabase
