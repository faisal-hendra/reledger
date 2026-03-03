import React from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

function PageHeader({ children }: Props): React.JSX.Element {
  const location = useLocation()
  return (
    <header className="h-14 flex items-center px-6 border-b border-[#303030] shrink-0 justify-between">
      <h2 className="text-lg font-medium text-white">
        {location.pathname === '/'
          ? 'Dashboard'
          : location.pathname.replace(/\//, '').charAt(0).toUpperCase() +
            location.pathname.replace(/\//, '').slice(1)}
      </h2>
      <div className="flex gap-2">{children && <>{children}</>}</div>
    </header>
  )
}

export default PageHeader
