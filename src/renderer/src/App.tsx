import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'

function App(): React.JSX.Element {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen">
          <AppSidebar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </AppSidebar>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
