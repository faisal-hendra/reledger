import { create } from 'zustand'
import { CURRENCIES } from '@/constants/currencies'

const STORAGE_KEY = 'reledger-currency'

function getInitialCurrency(): Currency {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const found = CURRENCIES.find((c) => c.code === stored)
    if (found) return found
  }
  return CURRENCIES[0]
}

type CurrencyState = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrency = create<CurrencyState>()((set) => ({
  currency: getInitialCurrency(),
  setCurrency: (currency: Currency) => {
    localStorage.setItem(STORAGE_KEY, currency.code)
    set({ currency })
  }
}))