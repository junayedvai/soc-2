import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'border-white/10 bg-white/5 text-foreground',
      critical: 'border-red-500/30 bg-red-500/15 text-red-100',
      high: 'border-orange-400/30 bg-orange-400/15 text-orange-100',
      medium: 'border-blue-400/30 bg-blue-400/15 text-blue-100',
      low: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-100',
      outline: 'border-white/15 bg-transparent'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
