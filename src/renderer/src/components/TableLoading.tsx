import React from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from './ui/spinner'

function TableLoading() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing your table</EmptyTitle>
        <EmptyDescription>Please wait while we process your transactions history.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default TableLoading
