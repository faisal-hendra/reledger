import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/pages/_pages'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

interface SidebarProps {
  children: React.ReactNode
}

export default function AppSidebar({ children }: SidebarProps): React.JSX.Element {
  const location = useLocation()
  const hideSidebar = true

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside
        className={`font-montserrat bg-transparent text-gray-300 text-sm flex flex-col shrink-0 pt-2 transition-all duration-200 ${
          hideSidebar ? 'w-15' : 'w-56'
        }`}
      >
        <nav className="flex flex-col gap-1 py-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            const ActiveIcon = item.activeIcon

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-[#414141] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {!isActive ? (
                      <Icon className="w-5 h-5 shrink-0" />
                    ) : (
                      <ActiveIcon className="w-5 h-5 shrink-0" />
                    )}
                    <span className={`font-medium truncate ${hideSidebar && 'hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className={!hideSidebar ? 'hidden' : ''}
                >
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 bg-[#191919] border-l border-[#303030] overflow-hidden flex flex-col">
        {/* <div
          className={`flex-1 overflow-auto p-6 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
        > */}
        <Toaster />
        {children}
        {/* </div> */}
      </main>
    </div>
  )
}
