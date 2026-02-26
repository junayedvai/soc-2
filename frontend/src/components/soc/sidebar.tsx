'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/components/soc/nav'
import { cn } from '@/lib/utils'
import { useAegisStore } from '@/store/aegis'
import { Separator } from '@/components/ui/separator'
import { Hexagon } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const role = useAegisStore((s) => s.session.role)
  const items = NAV.filter((i) => i.roles.includes(role))

  return (
    <aside className="w-[280px] hidden md:flex flex-col border-r border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-400/15 border border-white/10 flex items-center justify-center shadow-neon">
            <Hexagon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">AegisX</div>
            <div className="text-xs text-muted-foreground">Unified SOC Command</div>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors border border-transparent',
                  active ? 'bg-white/10 border-white/10' : 'hover:bg-white/5'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-cyan-300' : 'text-muted-foreground')} />
                <span className={cn(active ? 'text-foreground' : 'text-foreground/80')}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-muted-foreground">Environment</div>
          <div className="mt-1 text-sm font-medium">Production-ready demo</div>
          <div className="mt-2 text-[11px] text-muted-foreground">Multi-tenant • RBAC • SIEM+SOAR+AI</div>
        </div>
      </div>
    </aside>
  )
}
