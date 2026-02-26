'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { useAegisStore } from '@/store/aegis'
import { ShieldAlert, Siren, CheckCircle2, Cpu, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

export function KpiRow() {
  const k = useAegisStore((s) => s.selectors.kpis())

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <KpiCard title="Total Alerts" value={k.totalAlerts} icon={ShieldAlert} accent="from-sky-500/30 to-indigo-500/10" />
      <KpiCard title="Active Incidents" value={k.activeIncidents} icon={Siren} accent="from-orange-500/25 to-red-500/10" />
      <KpiCard title="Compliance Score" value={`${k.complianceScore}%`} icon={CheckCircle2} accent="from-emerald-500/25 to-teal-500/10" />
      <KpiCard title="Active Agents" value={k.activeAgents} icon={Cpu} accent="from-purple-500/25 to-fuchsia-500/10" />
      <KpiCard title="Global Threat Score" value={k.globalThreatScore} icon={Gauge} accent="from-indigo-500/25 to-sky-500/10" />
    </div>
  )
}

function KpiCard({
  title,
  value,
  icon: Icon,
  accent
}: {
  title: string
  value: string | number
  icon: any
  accent: string
}) {
  return (
    <GlassCard
      title={title}
      className={cn('p-4 overflow-hidden relative')}
      right={
        <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center border border-white/10', accent)}>
          <Icon className="h-5 w-5" />
        </div>
      }
    >
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      <div className={cn('pointer-events-none absolute inset-0 opacity-60 bg-gradient-to-br', accent)} />
    </GlassCard>
  )
}
