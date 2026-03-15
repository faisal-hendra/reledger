import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { TrendingDown, TrendingUp, Receipt } from 'lucide-react'
import { useCurrency } from '@/components/ui/use-currency'
import dayjs from 'dayjs'
interface Props {
  transactions: Transaction[]
  thisMonthTotal: MonthlyTotal
  topCategory?: CategoryPercentage
}

function QuickStats({ transactions, thisMonthTotal, topCategory }: Props): React.JSX.Element {
  const { currency } = useCurrency()

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `${currency.symbol}${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Receipt className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-semibold">{transactions?.length | 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingDown className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-muted-foreground">Avg. Daily Expense</p>
              <p className="text-xl font-semibold">
                {thisMonthTotal && formatCurrency(thisMonthTotal?.expense / dayjs().date())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-xl font-semibold">{topCategory?.category || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickStats
