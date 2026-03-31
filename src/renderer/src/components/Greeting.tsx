import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Link } from 'react-router-dom'

function Greeting(): React.JSX.Element {
  return (
    <Empty className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EmptyHeader>
        <EmptyMedia className="text-5xl wave">👋</EmptyMedia>
        <EmptyTitle>Welcome aboard</EmptyTitle>
        <EmptyDescription>
          To get started, head to {<Link to={'/transactions'}>Transactions page</Link>}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2"></EmptyContent>
    </Empty>
  )
}

export default Greeting
