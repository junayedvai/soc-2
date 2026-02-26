'use client'

import { FeatureTileGrid } from '@/components/soc/feature-tiles'
import { KpiRow } from '@/components/soc/kpis'
import { DashboardCharts } from '@/components/soc/charts'
import { useAegisStore } from '@/store/aegis'
import { GlassCard } from '@/components/soc/glass-card'

export default function UnifiedDashboardPage() {
  const { role, tenantId } = useAegisStore((s) => ({ role: s.session.role, tenantId: s.session.tenantId }))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">Unified SOC Command</div>
          <h1 className="text-2xl font-semibold tracking-tight">AegisX – Unified Dashboard</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Tenant <span className="text-foreground/90">{tenantId}</span> • Role{' '}
            <span className="text-foreground/90">{role}</span>
          </div>
        </div>
      </div>

      <KpiRow />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <DashboardCharts />
        </div>
        <div className="xl:col-span-4">
          <GlassCard title="Command Notes" subtitle="AI-assisted context feed">
            <CommandNotes />
          </GlassCard>
        </div>
      </div>

      <FeatureTileGrid />
    </div>
  )
}

function CommandNotes() {
  const notes = useAegisStore((s) => s.selectors.commandNotes())
  return (
    <div className="space-y-3">
      {notes.map((n) => (
        <div key={n.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{n.title}</div>
            <div className="text-[11px] text-muted-foreground">{n.timestamp}</div>
          </div>
          <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.body}</div>
        </div>
      ))}
    </div>
  )
}
