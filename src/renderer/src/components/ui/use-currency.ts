import { useContext } from 'react'
import { CurrencyProviderContext, CurrencyProviderState } from '@/contexts/currency-context'

export const useCurrency = (): CurrencyProviderState => {
  const context = useContext(CurrencyProviderContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
