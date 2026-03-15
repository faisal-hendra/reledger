import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Trash2Icon } from 'lucide-react'
import { useTheme } from './ui/theme-provider'

interface Props {
  children: React.ReactNode
  id: string
  onRefresh?: () => void
  alert?: () => void
}

function DeleteTransaction({ children, id, onRefresh, alert }: Props): React.JSX.Element {
  const handleDelete = async (): Promise<void> => {
    try {
      await window.api.deleteTransaction(id)
      onRefresh?.()
      alert?.()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    }
  }

  // Dimming for ttlebar in windows
  const { theme } = useTheme()
  const applyDim = (isOpen: boolean): void => {
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    window.api.dimTitlebar(isOpen, resolvedTheme)
  }

  const [open, setOpen] = useState<boolean>(false)

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        applyDim(isOpen)
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              handleDelete()
              applyDim(false)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTransaction
