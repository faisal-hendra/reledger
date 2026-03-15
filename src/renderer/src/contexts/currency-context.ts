import { createContext } from 'react'
import { CURRENCIES } from '@/constants/currencies'

export type CurrencyProviderState = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const initialState: CurrencyProviderState = {
  currency: CURRENCIES[0],
  setCurrency: () => null
}

export const CurrencyProviderContext = createContext<CurrencyProviderState>(initialState)
