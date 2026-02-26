'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GlassCard } from '@/components/soc/glass-card'
import { useAegisStore } from '@/store/aegis'
import { Shield, Radar, CheckSquare, Bot, BarChart3, Boxes } from 'lucide-react'
import { cn } from '@/lib/utils'

const tiles = [
  { title: 'SOC War Room', desc: 'Alert triage + case conversion', href: '/alerts', icon: Shield, roles: ['SOC_ANALYST', 'CISO'] as const },
  { title: 'Threat Intelligence', desc: 'Global landscape + IOC context', href: '/threat-landscape', icon: Radar, roles: ['SOC_ANALYST', 'CISO', 'EXECUTIVE'] as const },
  { title: 'Compliance Center', desc: 'Controls, evidence, audit trail', href: '/compliance', icon: CheckSquare, roles: ['CISO'] as const },
  { title: 'SOAR Automation', desc: 'Playbooks + simulated actions', href: '/incidents', icon: Bot, roles: ['SOC_ANALYST', 'CISO'] as const },
  { title: 'Executive Reports', desc: 'Board-ready view + exports', href: '/executive', icon: BarChart3, roles: ['CISO', 'EXECUTIVE'] as const },
  { title: 'Asset Monitoring', desc: 'Inventory + agent telemetry (mock)', href: '/settings', icon: Boxes, roles: ['SOC_ANALYST', 'CISO'] as const }
]

export function FeatureTileGrid() {
  const role = useAegisStore((s) => s.session.role)
  const pathname = usePathname()

  const visible = tiles.filter((t) => t.roles.includes(role as any))

  return (
    <GlassCard title="Modules" subtitle="Click a tile to open a functional module">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <div
              className={cn(
                'rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/8 hover:shadow-neon',
                pathname === t.href && 'ring-2 ring-ring/70'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t.desc}</div>
                </div>
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/25 to-cyan-400/10 flex items-center justify-center">
                  <t.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground group-hover:text-foreground/80">Open module →</div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}
