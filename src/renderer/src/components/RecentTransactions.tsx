import React from 'react'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import dayjs from 'dayjs'

interface Props {
  recentTransactions: Transaction[]
}

function RecentTransactions({ recentTransactions }: Props): React.JSX.Element {
  // Display transaction date whether if it's Today, Yesterday, or other date
  const displayTransactionDate = (trDate): string => {
    const todayDate = dayjs().format('YYYY-MM-DD')
    const yesterdayDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    if (trDate === todayDate) {
      return 'Today'
    } else if (trDate === yesterdayDate) {
      return 'Yesterday'
    } else {
      return dayjs(trDate).format('dddd, D MMM YYYY')
    }
  }

  return (
    <div className="rounded-xl border border-[#303030] overflow-hidden">
      <div className="flex px-5 py-4 border-b border-[#303030] justify-between">
        <h3 className="font-semibold text-white">Recent Transactions</h3>
        <h4 className="opacity-50">{`${dayjs().format('dddd, D MMM YYYY')}`}</h4>
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
                  tx.transaction_type === 'income'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {tx.transaction_type === 'income' ? (
                  <ArrowDownLeft className="w-4 h-4" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{tx.name}</div>
                <div className="text-xs text-gray-500">{`${displayTransactionDate(tx.date)}`}</div>
              </div>
            </div>
            <div
              className={`text-sm font-medium ${
                tx.transaction_type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {tx.transaction_type === 'income' ? '+' : ''}
              {tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions
