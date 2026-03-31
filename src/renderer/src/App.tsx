import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { CurrencyProvider } from '@/components/ui/currency-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import DateMismatchWarning from './pages/special/DateMismatchWarning'

// Detect OS platform for window styling
const platform = window.api.platform

// Main application component with routing and time synchronization
function App(): React.JSX.Element {
  // State for system clock validation
  const [isDateMatched, setIsDateMatched] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Compares local system date with server time to prevent synchronization issues
  async function fetchTime(): Promise<void> {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const url = `https://time.now/developer/api/timezone/${zone}`

    try {
      setIsLoading(true)
      const response = await fetch(url)
      const data: TimeResponse = await response.json()
      const realDate = data.datetime.toString().substring(0, 10)
      const systemDate = dayjs().format('YYYY-MM-DD')

      setIsDateMatched(realDate === systemDate)
    } catch (error) {
      console.error('Failed to sync time: ', error)
      setIsDateMatched(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Run time sync check on initial mount if online
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
                {/* Platform-aware window title bar */}
                <div
                  className={`dragable ${platform === 'win32' ? 'h-8' : 'h-8'} bg-titlebar flex items-center justify-center border-b border-border shrink-0`}
                >
                  <p className="text-xs select-none">Reledger</p>
                </div>

                {/* Sidebar navigation and route definitions */}
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
