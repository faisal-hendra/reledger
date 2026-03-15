import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { CurrencyProvider } from '@/components/ui/currency-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import DateMismatchWarning from './pages/special/DateMismatchWarning'

// Fetch platform name
const platform = window.api.platform

function App(): React.JSX.Element {
  const [isDateMatched, setIsDateMatched] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function fetchTime(): Promise<void> {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const url = `https://time.now/developer/api/timezone/${zone}`
    try {
      setIsLoading(true)
      const { data } = await axios.get<TimeResponse>(url)
      const realDate = data.datetime.toString().substring(0, 10)
      const systemDate = dayjs().format('YYYY-MM-DD')
      const compareDate = realDate === systemDate
      setIsDateMatched(compareDate)
    } catch (error) {
      console.error('Failed to sync time: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (navigator.onLine) {
      void (async () => {
        await fetchTime()
      })()
    }
  }, [])

  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <CurrencyProvider>
          <TooltipProvider>
            {isDateMatched ? (
              <div className="flex flex-col h-screen overflow-hidden">
                <div
                  className={`dragable ${platform === 'win32' ? 'h-8' : 'h-8'} bg-titlebar flex items-center justify-center border-b border-border shrink-0`}
                >
                  <p className="text-xs select-none">Reledger</p>
                </div>
                <AppSidebar>
                  <Routes>
                    <Route path="/" element={<Dashboard platform={platform} />} />
                    <Route path="/transactions" element={<Transactions platform={platform} />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AppSidebar>
              </div>
            ) : (
              <DateMismatchWarning onReload={fetchTime} isLoading={isLoading} />
            )}
          </TooltipProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </>
  )
}

export default App
