import { TrendingUp, Wallet, CreditCard } from 'lucide-react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RecentTransactions from '@/components/RecentTransactions'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

function Dashboard(): React.JSX.Element {
  // Mock data, replace these with the real ones when the db is ready
  const stats = [
    { label: 'Total Balance', value: '$12,450.00', change: '+12.5%', trend: 'up', icon: Wallet },
    { label: 'Income', value: '$8,200.00', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { label: 'Expenses', value: '$3,750.00', change: '-5.1%', trend: 'down', icon: CreditCard }
  ]

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState<MonthlyTotal>({
    income: 0,
    expense: 0
  })
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    const loadMonthlyTotal = async (): Promise<void> => {
      try {
        const filters = {
          month: dayjs().month(),
          year: dayjs().year()
        }
        const data = await window.api.getMonthlyTotal(filters)
        setMonthlyTotal(data)
      } catch (error) {
        console.log('Failed to fetch monthly total', error)
      }
    }
    loadMonthlyTotal()
  }, [])

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

  useEffect(() => {
    setBalance(monthlyTotal.income - monthlyTotal.expense)
  }, [monthlyTotal])

  return (
    <div className="space-y-6">
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
              <div className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <br />
      <RecentTransactions recentTransactions={recentTransactions} />
    </div>
  )
}

export default Dashboard
