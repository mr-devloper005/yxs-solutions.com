import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-current/10', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] bg-white px-4 py-10 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-current/50">{label}</p>
      <PulseBlock className="mt-5 h-12 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {[0, 1, 2].map((item) => (
            <div key={item} className="grid gap-4 border border-current/10 p-4 sm:grid-cols-[280px_minmax(0,1fr)]">
              <PulseBlock className="h-44 w-full" />
              <div>
                <PulseBlock className="h-8 w-3/4" />
                <PulseBlock className="mt-3 h-4 w-full" />
                <PulseBlock className="mt-2 h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {[0, 1, 2].map((item) => (
            <div key={item} className="border border-current/10 p-4">
              <PulseBlock className="h-40 w-full" />
              <PulseBlock className="mt-4 h-6 w-4/5" />
              <PulseBlock className="mt-3 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-current/10 bg-white p-4">
          <PulseBlock className="h-40 w-full" />
          <PulseBlock className="mt-4 h-6 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-32" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 bg-white px-4 py-10 lg:grid-cols-[1.08fr_0.92fr]', className)} aria-live="polite" aria-busy="true">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-current/50">{label}</p>
        <PulseBlock className="mt-5 h-12 w-4/5" />
        <PulseBlock className="mt-4 h-5 w-full" />
        <PulseBlock className="mt-2 h-5 w-5/6" />
        <PulseBlock className="mt-6 h-72 w-full" />
      </div>
      <div className="space-y-5">
        <div className="border border-current/10 p-5">
          <PulseBlock className="h-8 w-1/2" />
          <PulseBlock className="mt-4 h-12 w-full" />
          <PulseBlock className="mt-3 h-12 w-full" />
          <PulseBlock className="mt-3 h-12 w-2/3" />
        </div>
        <div className="border border-current/10 p-5">
          <PulseBlock className="h-8 w-1/2" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((item) => <PulseBlock key={item} className="aspect-[4/3] w-full" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
