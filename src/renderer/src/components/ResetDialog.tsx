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
import { useTheme } from '@/components/ui/theme-provider'
import { Button } from '@/components/ui/button'

interface Props {
  handleReset: () => void
}

function ResetDialog({ handleReset }: Props): React.JSX.Element {
  const { theme } = useTheme()

  return (
    <AlertDialog
      onOpenChange={(isOpen) => {
        const resolvedTheme =
          theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : theme
        window.api.dimTitlebar(isOpen, resolvedTheme)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Reset Ledger</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Reset Ledger?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all of your transaction history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleReset}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ResetDialog
