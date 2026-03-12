import { Wallet, ArrowUpRight, ArrowDownLeft, FunnelIcon } from 'lucide-react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RecentTransactions from '@/components/RecentTransactions'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import PageHeader from '@/components/PageHeader'
import { TrendChart } from '@/components/TrendChart'
import FilterDashboard from '@/components/FilterDashboard'
import { Button } from '@/components/ui/button'
import BreakdownChart from '@/components/BreakdownChart'

interface Props {
  platform: string
}

function Dashboard({ platform }: Props): React.JSX.Element {
  const [displayExpenseChart, setDisplayExpenseChart] = useState(true)
  const [displayIncomeChart, setDisplayIncomeChart] = useState(true)

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [thisMonthTotal, setThisMonthTotal] = useState<MonthlyTotal>({
    income: 0,
    expense: 0
  })
  const [lastMonthTotal, setLastMonthTotal] = useState<MonthlyTotal>({
    income: 0,
    expense: 0
  })
  const [currentBalance, setCurrentBalance] = useState<number>(0)
  const [lastMonthBalance, setLastMonthBalance] = useState<number>(0)
  const [stats, setStats] = useState<
    Array<{
      label: string
      value: string
      change: string
      trend: 'up' | 'down'
      isExpense: boolean
      icon: React.ElementType
    }>
  >([])

  const [fullMonthlyTotal, setFullMonthlyTotal] = useState<
    { month: number; income: number; expense: number }[] | undefined
  >(undefined)

  const [activeYear, setActiveYear] = useState(dayjs().year())
  const [activeMonth, setActiveMonth] = useState(dayjs().month() + 1)

  //
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryPercentage[] | null>([])

  // Get full breakdown of this year
  // Will be used for visualization
  useEffect(() => {
    const loadFullMonthlyTotal = async (): Promise<void> => {
      try {
        const data: { month: number; income: number; expense: number }[] | undefined =
          await window.api.getFullMonthlyTotal(activeYear)
        setFullMonthlyTotal(data)
      } catch (error) {
        console.log(error)
      }
    }
    loadFullMonthlyTotal()
  }, [activeYear, activeMonth])

  // Load this month total
  useEffect(() => {
    const loadThisMonthTotal = async (): Promise<void> => {
      try {
        const filters = {
          month: activeMonth,
          year: activeYear
        }
        const data = await window.api.getMonthlyTotal(filters)
        setThisMonthTotal(data)
      } catch (error) {
        console.log('Failed to fetch monthly total', error)
      }
    }
    loadThisMonthTotal()
  }, [activeMonth, activeYear])

  // Load last month total
  useEffect(() => {
    const loadLastMonthTotal = async (): Promise<void> => {
      try {
        const filters = {
          month: activeMonth - 1,
          year: activeYear
        }
        const data = await window.api.getMonthlyTotal(filters)
        setLastMonthTotal(data)
      } catch (error) {
        console.log('Failed to fetch last month total', error)
      }
    }
    loadLastMonthTotal()
  }, [activeMonth, activeYear])

  // Get recent transactions
  // Customizable by changing th rowCount const
  useEffect(() => {
    const loadRecentTransactions = async (): Promise<void> => {
      try {
        const rowCount = 5
        const data = await window.api.getRecentTransactions(rowCount)
        setRecentTransactions(data)
      } catch (error) {
        console.log('Failed to fetch recent transactions', error)
      }
    }
    loadRecentTransactions()
  }, [])

  // Calculate this month balance
  useEffect(() => {
    setCurrentBalance(thisMonthTotal.income - thisMonthTotal.expense)
  }, [thisMonthTotal])

  // Calculate last month balance
  useEffect(() => {
    setLastMonthBalance(lastMonthTotal.income - lastMonthTotal.expense)
  }, [lastMonthTotal])

  // Calculate stats with fetched data
  useEffect(() => {
    // Calculate percentage changes
    const calculatePercentageChange = (
      current: number,
      previous: number
    ): { change: string; trend: 'up' | 'down' } => {
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
    }

    // Format currency
    const formatCurrency = (amount: number): string => {
      return `$${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`
    }

    // Calculate stats
    const incomeChange = calculatePercentageChange(thisMonthTotal.income, lastMonthTotal.income)
    const expenseChange = calculatePercentageChange(thisMonthTotal.expense, lastMonthTotal.expense)
    const balanceChange = calculatePercentageChange(currentBalance, lastMonthBalance)

    const newStats = [
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

    setStats(newStats)
  }, [thisMonthTotal, lastMonthTotal, currentBalance, lastMonthBalance])

  // Determine the color for the percantage comparison
  const determineStatsColor = (trend: string, isExpense: boolean): string => {
    let styling = ''
    if (!isExpense) {
      styling = trend === 'up' ? 'text-green-400' : 'text-red-400'
    } else {
      styling = trend === 'up' ? 'text-red-400' : 'text-green-400'
    }
    return styling
  }

  useEffect(() => {
    const getCategory = async (): Promise<void> => {
      const filters: CategoryPerecentageFilters = {
        year: activeYear,
        month: activeMonth,
        type: 'expense'
      }
      const data = await window.api.getCategoryPercentage(filters)
      console.log(data)
      setCategoryBreakdown(data)
    }
    getCategory()
  }, [activeMonth, activeYear])

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
        >
          <Button variant="outline">
            <FunnelIcon />
          </Button>
        </FilterDashboard>
      </PageHeader>
      <div
        className={`space-y-6 flex-1 overflow-auto p-6 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-gray-400">{stat.label}</CardTitle>
                <CardAction>
                  <div className={`flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3"></div>
                <div className="text-2xl font-semibold text-white mb-1">{stat.value}</div>
                <div className={`text-xs ${determineStatsColor(stat.trend, stat.isExpense)}`}>
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex grid grid-cols-1 lg:grid-cols-5 gap-6 pt-6 overflow-visible">
          <div className="lg:col-span-4">
            <TrendChart
              data={fullMonthlyTotal}
              displayIncomeChart={displayIncomeChart}
              displayExpenseChart={displayExpenseChart}
              year={activeYear}
            />
          </div>
          <div className="lg:col-span-1">
            <BreakdownChart data={categoryBreakdown} />
          </div>
        </div>
        <div className="pt-6">
          <RecentTransactions recentTransactions={recentTransactions} />
        </div>
      </div>
    </>
  )
}

export default Dashboard
