import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import { TooltipProvider } from '@/components/ui/tooltip'

// Fetch platform name
const platform = window.api.platform

function App(): React.JSX.Element {
  return (
    <>
      {/* For development only dark mode will be used, theme switch will be added later */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <div
              className={`dragable ${platform === 'win32' ? 'h-8' : 'h-6.5'} bg-[#1b1b1b] flex items-center justify-center border-b border-[#292929] shrink-0`}
            >
              <p className="text-xs text-white select-none">Reledger</p>
            </div>
            <AppSidebar platform={platform}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
              </Routes>
            </AppSidebar>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}

export default App
