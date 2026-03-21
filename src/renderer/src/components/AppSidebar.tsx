import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/pages/_pages'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

interface SidebarProps {
  // Component to render inside the main content area
  children: React.ReactNode
}

export default function AppSidebar({ children }: SidebarProps): React.JSX.Element {
  const location = useLocation()
  // Hardcoded to true - sidebar is always collapsed to icon-only width
  // The project initially started with dynamic sidebar, but turns out it got a bit cluttered
  // Set to false to show full sidebar with labels
  const hideSidebar = true

  return (
    <div className="flex flex-1 overflow-hidden bg-sidebar">
      <aside
        className={`font-montserrat bg-transparent text-sm flex flex-col shrink-0 pt-2 transition-all duration-200 ${
          hideSidebar ? 'w-15' : 'w-56'
        }`}
      >
        {/* Main navigation section - displays all nav items except settings */}
        <nav className="flex flex-1 flex-col gap-1 py-0.5 px-2">
          {navItems
            // Filter out settings from main navigation
            // Settings are rendered separately below for consistent layout
            .filter((item) => item.path !== '/settings')
            .map((item) => {
              // Check if current route matches this nav item
              const isActive = location.pathname === item.path
              // Icon component for inactive state
              const Icon = item.icon
              // Icon component for active/hover state - can be different from inactive icon
              const ActiveIcon = item.activeIcon

              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link
                      key={item.path}
                      to={item.path}
                      // Link styling with conditional classes based on active state:
                      // - Active: dark background (#414141) with white text
                      // - Inactive: gray text (#404040) with dark hover background (#2a2a2a)
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                        isActive
                          ? 'bg-sidebar-active text-white'
                          : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                      }`}
                    >
                      {/* Dynamic icon based on active state */}
                      {!isActive ? (
                        <Icon className="w-5 h-5 shrink-0" />
                      ) : (
                        <ActiveIcon className="w-5 h-5 shrink-0" />
                      )}
                      {/* Label text - hidden when sidebar is collapsed */}
                      <span className={`font-medium truncate ${hideSidebar && 'hidden'}`}>
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {/* Tooltip popup shown when hover on collapsed sidebar */}
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                    // Hide tooltip when sidebar is visible (not collapsed)
                    className={!hideSidebar ? 'hidden' : ''}
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
        </nav>

        {/* Settings navigation section - always shown at bottom */}
        <nav className="flex flex-col gap-1 py-0.5 px-2 py-3">
          {navItems
            /* Filter to include only the settings path item */
            .filter((item) => item.path === '/settings')
            .map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              const ActiveIcon = item.activeIcon

              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link
                      key={item.path}
                      to={item.path}
                      // Same styling pattern as main nav, but with py-3 padding
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                        isActive
                          ? 'bg-sidebar-active text-white'
                          : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                      }`}
                    >
                      {/* Dynamic icon based on active state */}
                      {!isActive ? (
                        <Icon className="w-5 h-5 shrink-0" />
                      ) : (
                        <ActiveIcon className="w-5 h-5 shrink-0" />
                      )}
                      {/* Label text - hidden when sidebar is collapsed */}
                      <span className={`font-medium truncate ${hideSidebar && 'hidden'}`}>
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {/* Tooltip popup shown when hover on collapsed sidebar */}
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                    // Hide tooltip when sidebar is visible (not collapsed)
                    className={!hideSidebar ? 'hidden' : ''}
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
        </nav>
      </aside>

      {/* Main content area - takes remaining space */}
      <main className="flex-1 bg-main-content border-l border-border overflow-hidden flex flex-col">
        <Toaster /> {/* Toast notifications component */}
        {children} {/* Render child components in main area */}
      </main>
    </div>
  )
}
