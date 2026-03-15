import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { CalendarOffIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  onReload: () => void
  isLoading: boolean
}

function DateMismatchWarning({ onReload, isLoading }: Props): React.JSX.Element {
  return (
    <>
      <div className="h-screen">
        <div className={`dragable h-8 bg-titlebar flex items-center justify-center shrink-0`}></div>
        <div className="flex h-full justify-center items-center -translate-y-8 overflow-hidden">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarOffIcon />
              </EmptyMedia>
              <EmptyTitle>System Date Mismatch Detected</EmptyTitle>
              <EmptyDescription>
                Your device`s date or time does not match the verified current time for your
                timezone. This application requires an accurate date to function correctly. Please
                correct your device settings to continue.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={() => {
                  onReload()
                }}
              >
                {!isLoading ? <RefreshCwIcon /> : <Spinner />}
                Retry
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </>
  )
}

export default DateMismatchWarning
