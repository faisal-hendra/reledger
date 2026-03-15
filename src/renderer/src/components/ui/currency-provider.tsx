import { useState } from 'react'
import { CURRENCIES } from '@/constants/currencies'
import { CurrencyProviderContext, CurrencyProviderState } from '@/contexts/currency-context'

type CurrencyProviderProps = {
  children: React.ReactNode
  defaultCurrency?: string
  storageKey?: string
}

export function CurrencyProvider({
  children,
  defaultCurrency = 'USD',
  storageKey = 'reledger-currency',
  ...props
}: CurrencyProviderProps): React.JSX.Element {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const found = CURRENCIES.find((c) => c.code === stored)
      return found || CURRENCIES[0]
    }
    return CURRENCIES.find((c) => c.code === defaultCurrency) || CURRENCIES[0]
  })

  const setCurrency = (currency: Currency): void => {
    localStorage.setItem(storageKey, currency.code)
    setCurrencyState(currency)
  }

  const value: CurrencyProviderState = {
    currency,
    setCurrency
  }

  return (
    <CurrencyProviderContext.Provider {...props} value={value}>
      {children}
    </CurrencyProviderContext.Provider>
  )
}
