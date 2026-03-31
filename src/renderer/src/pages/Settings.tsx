import { ModeToggle } from '@/components/ui/mode-toggle'
import { useCurrency } from '@/components/ui/use-currency'
import { CURRENCIES } from '@/constants/currencies'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import PageHeader from '@/components/PageHeader'
import { toast } from 'sonner'
import ResetDialog from '@/components/ResetDialog'

const handleReset = async (): Promise<void> => {
  try {
    window.api.resetTable()
  } catch (error) {
    console.error(error)
  } finally {
    toast('Ledger has been reset')
  }
}

function Settings(): React.JSX.Element {
  const { currency, setCurrency } = useCurrency()

  return (
    <>
      <PageHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="grow space-y-6 flex grid grid-cols-1 gap-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">General</h3>
            <div className=" pt-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Currency Symbol
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred currency for display
                  </p>
                </div>
                <Select
                  value={currency.code}
                  onValueChange={(value) => {
                    const selected = CURRENCIES.find((c) => c.code === value)
                    if (selected) setCurrency(selected)
                  }}
                >
                  <SelectTrigger className="min-w-30 max-w-full min-h-12">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="">
                      {CURRENCIES.map((c) => (
                        <SelectItem
                          key={c.code}
                          value={c.code}
                          className="group px-3 py-2.5 cursor-pointer rounded-none focus:bg-accent/60 data-[state=checked]:bg-primary/8"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-foreground group-focus:bg-primary/10">
                              {c.symbol}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-semibold leading-none text-foreground">
                                {c.code}
                              </span>
                              <span className="text-xs text-muted-foreground truncate mt-0.5">
                                {c.name}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Appearance</h3>
            <div className=" pt-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Theme
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Customize the appearance of the app
                  </p>
                </div>
                <ModeToggle />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-6">Danger Zone</h3>
            <div className=" pt-4"></div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Reset
                </label>
                <p className="text-sm text-muted-foreground">
                  Completely delete transaction history. This action can NOT be undone!
                </p>
              </div>
              <ResetDialog handleReset={handleReset} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Settings
