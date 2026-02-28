import { TrendingUp, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Dashboard(): React.JSX.Element {
  // Mock data, replace these with the real ones when the db is ready
  const stats = [
    { label: 'Total Balance', value: '$12,450.00', change: '+12.5%', trend: 'up', icon: Wallet },
    { label: 'Income', value: '$8,200.00', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { label: 'Expenses', value: '$3,750.00', change: '-5.1%', trend: 'down', icon: CreditCard }
  ]

  const recentTransactions = [
    { id: 1, name: 'Grocery Store', date: 'Today', amount: -124.5, type: 'expense' },
    { id: 2, name: 'Salary', date: 'Yesterday', amount: 4500.0, type: 'income' },
    { id: 3, name: 'Electric Bill', date: 'Feb 25', amount: -89.0, type: 'expense' },
    { id: 4, name: 'Freelance Work', date: 'Feb 24', amount: 750.0, type: 'income' },
    { id: 5, name: 'Internet', date: 'Feb 23', amount: -59.99, type: 'expense' }
  ]

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
      <div className="rounded-xl border border-[#303030] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#303030]">
          <h3 className="font-semibold text-white">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-[#303030]">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'income'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{tx.name}</div>
                  <div className="text-xs text-gray-500">{tx.date}</div>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  tx.type === 'income' ? 'text-green-400' : 'text-white'
                }`}
              >
                {tx.type === 'income' ? '+' : ''}
                {tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
