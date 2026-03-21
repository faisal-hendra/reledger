import { Wallet, ArrowUpRight, ArrowDownLeft, FunnelIcon } from 'lucide-react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RecentTransactions from '@/components/RecentTransactions'
import { useEffect, useState, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import PageHeader from '@/components/PageHeader'
import { TrendChart } from '@/components/TrendChart'
import FilterDashboard from '@/components/FilterDashboard'
import { Button } from '@/components/ui/button'
import BreakdownChart from '@/components/BreakdownChart'
import QuickStats from '@/components/QuickStats'
import { useCurrency } from '@/components/ui/use-currency'
import { BigNumber } from '@/constants/bignumber'

/**
 * Props interface for the Dashboard page
 * Defines the platform-specific context for rendering
 */
interface Props {
  /** Platform identifier (e.g., 'win32') for platform-specific styling */
  platform: string
}

function Dashboard({ platform }: Props): React.JSX.Element {
  const { currency } = useCurrency()
  const [displayExpenseChart, setDisplayExpenseChart] = useState(true)
  const [displayIncomeChart, setDisplayIncomeChart] = useState(true)
  const [currentBalance, setCurrentBalance] = useState<number>(0)
  const [lastMonthBalance, setLastMonthBalance] = useState<number>(0)
  const [fullMonthlyTotal, setFullMonthlyTotal] = useState<MonthlyTotal[]>([])
  const [activeYear, setActiveYear] = useState(dayjs().year())
  const [activeMonth, setActiveMonth] = useState(dayjs().month() + 1)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [thisMonthTotal, setThisMonthTotal] = useState<MonthlyTotal>({
    month: activeMonth,
    income: 0,
    expense: 0
  })
  const [lastMonthTotal, setLastMonthTotal] = useState<MonthlyTotal>({
    month: activeMonth - 1,
    income: 0,
    expense: 0
  })
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryPercentage[] | null>([])
  const [categroyBreakdownType, setCategoryBreakdownType] = useState<'income' | 'expense'>(
    'expense'
  )
  const [thisMonthTransactions, setThisMonthTransactions] = useState<Transaction[] | undefined>(
    undefined
  )

  const [topExpense, setTopExpense] = useState<Transaction>()

  const loadFullMonthlyTotal = useCallback(async (): Promise<void> => {
    try {
      const data = await window.api.getFullMonthlyTotal(activeYear)
      setFullMonthlyTotal(data || [])
    } catch (error) {
      console.error('Failed to load full monthly total:', error)
      setFullMonthlyTotal([])
    }
  }, [activeYear])

  const loadThisMonthTotal = useCallback(async (): Promise<void> => {
    try {
      const filters = {
        month: activeMonth,
        year: activeYear
      }
      const data = await window.api.getMonthlyTotal(filters)
      setThisMonthTotal(data)
    } catch (error) {
      console.error('Failed to fetch monthly total:', error)
    }
  }, [activeMonth, activeYear])

  const loadLastMonthTotal = useCallback(async (): Promise<void> => {
    try {
      const filters = {
        month: activeMonth - 1,
        year: activeYear
      }
      const data = await window.api.getMonthlyTotal(filters)
      setLastMonthTotal(data)
    } catch (error) {
      console.error('Failed to fetch last month total:', error)
    }
  }, [activeMonth, activeYear])

  const loadRecentTransactions = useCallback(async (): Promise<void> => {
    try {
      const rowCount = 5
      const data = await window.api.getRecentTransactions(rowCount)
      setRecentTransactions(data)
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error)
    }
  }, [])

  const loadCategoryBreakdown = useCallback(async (): Promise<void> => {
    try {
      const filters: CategoryPerecentageFilters = {
        year: activeYear,
        month: activeMonth,
        type: categroyBreakdownType
      }
      const data = await window.api.getCategoryPercentage(filters)
      setCategoryBreakdown(data)
    } catch (error) {
      console.error('Failed to fetch category breakdown:', error)
    }
  }, [activeYear, activeMonth, categroyBreakdownType])

  const fetchThisMonthTransactions = useCallback(async (): Promise<void> => {
    try {
      const filters: TransactionFilters = {
        month: activeMonth,
        year: activeYear,
        keyword: null,
        transaction_type: null,
        category: null,
        limit: BigNumber(),
        offset: 0
      }
      const data = await window.api.getTransactions(filters)
      setThisMonthTransactions(data.transactions)
    } catch (error) {
      console.error('Failed to fetch this month transactions:', error)
    }
  }, [activeMonth, activeYear])

  const getTopExpense = useCallback(() => {
    if (thisMonthTransactions) {
      const amountArray = thisMonthTransactions?.map((t) => t.amount)
      const maxValue = Math.max(...amountArray)
      const fetchTopExpense = thisMonthTransactions.find((t) => t.amount === maxValue)
      setTopExpense(fetchTopExpense)
    }
  }, [thisMonthTransactions])

  useEffect(() => {
    getTopExpense()
  }, [thisMonthTransactions])

  useEffect(() => {
    loadFullMonthlyTotal()
  }, [activeYear])

  useEffect(() => {
    loadThisMonthTotal()
  }, [activeMonth, activeYear])

  useEffect(() => {
    loadLastMonthTotal()
  }, [activeMonth, activeYear])

  useEffect(() => {
    loadRecentTransactions()
  }, [])

  useEffect(() => {
    setCurrentBalance(thisMonthTotal.income - thisMonthTotal.expense)
  }, [thisMonthTotal])

  useEffect(() => {
    setLastMonthBalance(lastMonthTotal.income - lastMonthTotal.expense)
  }, [lastMonthTotal])

  useEffect(() => {
    loadCategoryBreakdown()
  }, [activeMonth, activeYear, categroyBreakdownType])

  useEffect(() => {
    fetchThisMonthTransactions()
  }, [activeMonth, activeYear])

  const calculatePercentageChange = useCallback(
    /**
     * Calculates the percentage change between current and previous values.
     * Handles edge cases where either value is zero.
     * @param current - Current value to compare
     * @param previous - Previous value for comparison
     * @returns Object containing formatted change percentage and trend direction
     */
    (current: number, previous: number): { change: string; trend: 'up' | 'down' } => {
      if (previous === 0 || current === 0) {
        return { change: current > 0 ? '+100%' : '0%', trend: current >= 0 ? 'up' : 'down' }
      }

      const change = (current - previous) / previous
      if (isFinite(change)) {
        return {
          change: `${change >= 0 ? '+' : ''}${(change * 100).toFixed(1)}%`,
          trend: change >= 0 ? 'up' : 'down'
        }
      }

      return { change: '0%', trend: 'down' }
    },
    []
  )

  const formatCurrency = useCallback(
    /**
     * Formats a numeric amount as currency string.
     */
    (amount: number): string => {
      return `${currency.symbol}${
        amount?.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) ?? '0.00'
      }`
    },
    [currency.symbol]
  )

  const determineStatsColor = useCallback(
    /**
     * Determines appropriate color for statistical trend display.
     * Inverts color for expenses (up=bad, down=good).
     * @param trend - Trend direction ('up' or 'down')
     * @param isExpense - Whether this stat represents an expense
     * @returns Tailwind CSS color class name
     */
    (trend: string, isExpense: boolean): string => {
      if (!isExpense) {
        return trend === 'up' ? 'text-green-400' : 'text-red-400'
      }
      return trend === 'up' ? 'text-red-400' : 'text-green-400'
    },
    []
  )

  const stats = useMemo(() => {
    const incomeChange = calculatePercentageChange(thisMonthTotal.income, lastMonthTotal.income)
    const expenseChange = calculatePercentageChange(thisMonthTotal.expense, lastMonthTotal.expense)
    const balanceChange = calculatePercentageChange(currentBalance, lastMonthBalance)

    /**
     * Returns array of statistical metric cards to display.
     * Each card shows Total Balance, Income, and Expenses with month-over-month change.
     */
    return [
      {
        label: 'Total Balance',
        value: formatCurrency(currentBalance),
        change: balanceChange.change,
        trend: balanceChange.trend,
        isExpense: false,
        icon: Wallet
      },
      {
        label: 'Income',
        value: formatCurrency(thisMonthTotal.income),
        change: incomeChange.change,
        trend: incomeChange.trend,
        isExpense: false,
        icon: ArrowDownLeft
      },
      {
        label: 'Expenses',
        value: formatCurrency(thisMonthTotal.expense),
        change: expenseChange.change,
        trend: expenseChange.trend,
        isExpense: true,
        icon: ArrowUpRight
      }
    ]
  }, [
    thisMonthTotal,
    lastMonthTotal,
    currentBalance,
    lastMonthBalance,
    calculatePercentageChange,
    formatCurrency
  ])

  return (
    <>
      <PageHeader>
        <FilterDashboard
          displayIncomeChart={displayIncomeChart}
          displayExpenseChart={displayExpenseChart}
          setDisplayIncomeChart={setDisplayIncomeChart}
          setDisplayExpenseChart={setDisplayExpenseChart}
          year={activeYear}
          setYear={setActiveYear}
          month={activeMonth}
          setMonth={setActiveMonth}
          transactionType={categroyBreakdownType}
          setTransactionType={setCategoryBreakdownType}
        >
          <Button variant="outline">
            <FunnelIcon />
          </Button>
        </FilterDashboard>
      </PageHeader>
      <div
        className={`space-y-6 flex-1 overflow-auto p-4 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none">
              <CardHeader>
                <CardTitle className="">{stat.label}</CardTitle>
                <CardAction>
                  <div className="flex items-center justify-center">
                    <stat.icon className="w-4 h-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3"></div>
                <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                <div className={`text-xs ${determineStatsColor(stat.trend, stat.isExpense)}`}>
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 overflow-visible">
          <div className="lg:col-span-2">
            <TrendChart
              data={fullMonthlyTotal}
              displayIncomeChart={displayIncomeChart}
              displayExpenseChart={displayExpenseChart}
            />
          </div>
          <div className="lg:col-span-1">
            <BreakdownChart data={categoryBreakdown} transactionType={categroyBreakdownType} />
          </div>
        </div>
        <div className="pt-4">
          {thisMonthTransactions && (
            <QuickStats
              transactions={thisMonthTransactions}
              thisMonthTotal={thisMonthTotal}
              topExpense={topExpense}
            />
          )}
        </div>
        <div className="pt-4">
          <RecentTransactions recentTransactions={recentTransactions} />
        </div>
      </div>
    </>
  )
}

export default Dashboard
