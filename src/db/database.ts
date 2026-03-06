import { app } from 'electron'
import path from 'node:path'
import Database from 'better-sqlite3'

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

  updateTransaction(transaction: Transaction): void {
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

  deleteTransaction(TransactionID: number): void {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM transactions WHERE id = ?
      `)
      stmt.run(TransactionID)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  }

  getTransactions(filters: TransactionFilters): Transaction[] {
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
      } else {
        query += ' ORDER BY date(date) DESC'
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

  getTransactionById(TransactionID: number): Transaction | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM transactions WHERE id = ?
      `)
      return stmt.get(TransactionID) as Transaction | null
    } catch (error) {
      console.error('Failed to get transaction by id:', error)
      throw error
    }
  }

  getRecentTransactions(limit: number): Transaction[] | null {
    try {
      console.log('Get recent transaction starts')
      const query = `SELECT * FROM transactions ORDER BY date(date) DESC LIMIT ?`
      const stmt = this.db.prepare(query)
      console.log('Recent transactions from db:', stmt.all(limit) as Transaction[])
      return stmt.all(limit) as Transaction[]
    } catch (error) {
      console.log('Failed to get recent transaction: ', error)
      throw error
    }
  }

  getMonthlyTotal(filters: MonthlyTotalFilters): MonthlyTotal | null {
    try {
      let query = `
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
    `
      const params: (string | number)[] = []
      const conditions: string[] = []

      if (filters.month) {
        conditions.push("strftime('%m', date) = ?")
        params.push(filters.month.toString().padStart(2, '0'))
      }
      if (filters.year) {
        conditions.push("strftime('%Y', date) = ?")
        params.push(filters.year.toString())
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
      }

      const stmt = this.db.prepare(query)
      return stmt.get(...params) as MonthlyTotal
    } catch (error) {
      console.log('Failed to fetch monthly total', error)
      throw error
    }
  }

  getFullMonthlyTotal(
    year: number
  ): { month: number; income: number; expense: number }[] | undefined {
    try {
      const query = `
      SELECT 
        month.month as month,
        COALESCE(total.income, 0) as income,
        COALESCE(total.expense, 0) as expense
      FROM (
        SELECT 1 as month UNION ALL
        SELECT 2 as month UNION ALL
        SELECT 3 as month UNION ALL
        SELECT 4 as month UNION ALL
        SELECT 5 as month UNION ALL
        SELECT 6 as month UNION ALL
        SELECT 7 as month UNION ALL
        SELECT 8 as month UNION ALL
        SELECT 9 as month UNION ALL
        SELECT 10 as month UNION ALL
        SELECT 11 as month UNION ALL
        SELECT 12 as month
      ) as month
      LEFT JOIN (
        SELECT 
          CAST(strftime('%m', date) AS INTEGER) as month,
          SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE strftime('%Y', date) = ?
        GROUP BY month
      ) as total ON month.month = total.month
    `
      const stmt = this.db.prepare(query)
      console.log(
        'From DB: ',
        stmt.all(year.toString()) as { month: number; income: number; expense: number }[]
      )
      return stmt.all(year.toString()) as { month: number; income: number; expense: number }[]
    } catch (error) {
      console.log('Failed to fetch full monthly total', error)
      throw error
    }
  }

  getAvailableYears(): GetYear[] {
    try {
      const stmt = this.db.prepare(`
      SELECT DISTINCT CAST(strftime('%Y', date) AS INTEGER) AS year 
      FROM transactions 
      ORDER BY year
    `)
      return stmt.all() as GetYear[]
    } catch (error) {
      console.log('Failed to fetch years: ', error)
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
