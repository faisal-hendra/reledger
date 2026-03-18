import { app } from 'electron'
import path from 'node:path'
import Database from 'better-sqlite3'

class AppDatabase {
  db: Database.Database

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'reledger.sqlite')
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.setUpDatabase()
  }

  setUpDatabase(): void {
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

  deleteTransaction(transactionId: number): void {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM transactions WHERE id = ?
      `)
      stmt.run(transactionId)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  }

  getTransactions(filters: TransactionFilters): { transactions: Transaction[]; total: number } {
    try {
      let query = 'SELECT * FROM transactions WHERE 1=1'
      let countQuery = 'SELECT COUNT(*) as count FROM transactions WHERE 1=1'
      const params: (string | number)[] = []
      const countParams: (string | number)[] = []

      if (filters.month) {
        const monthCondition = " AND strftime('%m', date) = ?"
        query += monthCondition
        countQuery += monthCondition
        const monthVal = filters.month.toString().padStart(2, '0')
        params.push(monthVal)
        countParams.push(monthVal)
      }
      if (filters.year) {
        const yearCondition = " AND strftime('%Y', date) = ?"
        query += yearCondition
        countQuery += yearCondition
        const yearVal = filters.year.toString()
        params.push(yearVal)
        countParams.push(yearVal)
      }
      if (filters.keyword) {
        const keywordCondition = ' AND (name LIKE ? OR description LIKE ?)'
        query += keywordCondition
        countQuery += keywordCondition
        const keywordVal = `%${filters.keyword}%`
        params.push(keywordVal, keywordVal)
        countParams.push(keywordVal, keywordVal)
      }
      if (filters.category) {
        const categoryCondition = ' AND category = ?'
        query += categoryCondition
        countQuery += categoryCondition
        params.push(filters.category)
        countParams.push(filters.category)
      }

      const sortColumn = filters.sortColumn || 'date'
      const sortDirection = filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
      if (sortColumn === 'date') {
        query += ` ORDER BY date(${sortColumn}) ${sortDirection}`
      } else {
        query += ` ORDER BY ${sortColumn} ${sortDirection}`
      }

      if (filters.limit !== undefined) {
        query += ` LIMIT ${filters.limit}`
        if (filters.offset !== undefined) {
          query += ` OFFSET ${filters.offset}`
        }
      }

      const stmt = this.db.prepare(query)
      const transactions = stmt.all(...params) as Transaction[]

      const countStmt = this.db.prepare(countQuery)
      const countResult = countStmt.get(...countParams) as { count: number }

      return {
        transactions,
        total: countResult.count
      }
    } catch (error) {
      console.error('Failed to get all transactions:', error)

      throw error
    }
  }

  getTransactionById(transactionId: number): Transaction | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM transactions WHERE id = ?
      `)
      return stmt.get(transactionId) as Transaction | null
    } catch (error) {
      console.error('Failed to get transaction by id:', error)
      throw error
    }
  }

  getRecentTransactions(limit: number): Transaction[] | null {
    try {
      const query = `SELECT * FROM transactions ORDER BY date(date) DESC LIMIT ?`
      const stmt = this.db.prepare(query)
      return stmt.all(limit) as Transaction[]
    } catch (error) {
      console.error('Failed to get recent transaction: ', error)
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
      console.error('Failed to fetch monthly total', error)
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
      return stmt.all(year.toString()) as { month: number; income: number; expense: number }[]
    } catch (error) {
      console.error('Failed to fetch full monthly total', error)
      throw error
    }
  }

  getAvailableYears(): GetYear[] {
    try {
      const stmt = this.db.prepare(`
      SELECT DISTINCT CAST(strftime('%Y', date) AS INTEGER) AS year
      FROM transactions
      ORDER BY year DESC
    `)
      return stmt.all() as GetYear[]
    } catch (error) {
      console.error('Failed to fetch years: ', error)
      throw error
    }
  }

  getCategoryPercentage(filters: CategoryPerecentageFilters): CategoryPercentage[] | null {
    try {
      const stmt = this.db.prepare(`
        SELECT
          category,
          SUM(amount) AS category_total,
          SUM(amount) * 100.0 / (
            SELECT SUM(amount)
            FROM transactions
            WHERE
              strftime('%Y', date) = ?
              AND strftime('%m', date) = ?
              AND transaction_type = ?
          ) AS percentage
        FROM
          transactions
        WHERE
          strftime('%Y', date) = ?
          AND strftime('%m', date) = ?
          AND transaction_type = ?
        GROUP BY
          category
        ORDER BY
          percentage DESC;
          `)
      return stmt.all(
        filters.year.toString(),
        filters.month.toString().padStart(2, '0'),
        filters.type,
        filters.year.toString(),
        filters.month.toString().padStart(2, '0'),
        filters.type
      ) as CategoryPercentage[]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  resetTable(): void {
    try {
      this.db.exec(`DELETE FROM transactions`)
    } catch (error) {
      console.error('Failed to reset table: ', error)
    }
  }

  close(): void {
    try {
      this.db.close()
    } catch (error) {
      console.error('Failed to close the database: ', error)
    }
  }
}

export default AppDatabase
