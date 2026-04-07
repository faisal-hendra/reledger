import React from 'react'
import { CalendarOffIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  onReload: () => void
  isLoading: boolean
}

function DateMismatchWarning({ onReload, isLoading }: Props): React.JSX.Element {
  return (
    <div className="h-screen bg-main-content">
      {/* Titlebar */}
      <div className="dragable h-8 flex items-center justify-center shrink-0" />
      {/* Main content */}
      <div className="flex h-full justify-center items-center -translate-y-8 overflow-hidden px-6">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
            <CalendarOffIcon className="h-7 w-7" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              System Date Mismatch
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your device&apos;s date doesn&apos;t match the verified time for your timezone. Please
              correct your system clock to continue.
            </p>
          </div>
          <div className="w-full border-t border-border" />
          <div className="flex flex-col items-center gap-3 w-full">
            <Button onClick={onReload} disabled={isLoading} className="w-full gap-2">
              {isLoading ? <Spinner className="h-4 w-4" /> : <RefreshCwIcon className="h-4 w-4" />}
              {isLoading ? 'Checking…' : 'Retry'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Fix your clock in{' '}
              <span className="font-medium text-foreground">System Settings → Date &amp; Time</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateMismatchWarning
