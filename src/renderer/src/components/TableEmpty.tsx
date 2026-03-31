import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia
} from '@/components/ui/empty'
import { Table2Icon } from 'lucide-react'

function TableEmpty(): React.JSX.Element {
  return (
    <div className="flex h-full">
      <Empty className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table2Icon />
          </EmptyMedia>
          <EmptyDescription>
            No transaction found for the selected period or category. To get started, click the Add
            button in the top-right corner.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2"></EmptyContent>
      </Empty>
    </div>
  )
}

export default TableEmpty
