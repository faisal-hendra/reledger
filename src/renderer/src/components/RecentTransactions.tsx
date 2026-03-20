import React from 'react'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import dayjs from 'dayjs'
import { Label } from './ui/label'

interface Props {
  recentTransactions: Transaction[]
}

function RecentTransactions({ recentTransactions }: Props): React.JSX.Element {
  // Returns human-readable date: 'Today', 'Yesterday', or full date format
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
    <div className="bg-card rounded-xl shadow-none">
      <div className="border rounded-xl border-border  overflow-hidden">
        {recentTransactions.length > 0 ? (
          <>
            <div className="flex px-5 py-4 border-b border-border justify-between">
              <h3 className="font-semibold ">Recent Transactions</h3>
              <h4 className="opacity-50">{displayTransactionDate(recentTransactions[0]?.date)}</h4>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-highlight transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon direction: income shows downward arrow (money coming in), expense shows upward (money going out) */}
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
                      <div className="text-sm font-medium text">{tx.name}</div>
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
          </>
        ) : (
          <div className="flex p-10 justify-center">
            <Label className="opacity-50">No recent transaction available.</Label>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions
