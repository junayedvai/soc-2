'use client'

import { IncidentsPanel } from '@/components/soc/modules/incidents-panel'
import { GlassCard } from '@/components/soc/glass-card'

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">Case Management + SOAR</div>
        <h1 className="text-2xl font-semibold tracking-tight">Incidents & Playbooks</h1>
      </div>

      <GlassCard title="Incident Queue" subtitle="Convert alerts to cases • Execute playbooks • Audit trail">
        <IncidentsPanel />
      </GlassCard>
    </div>
  )
}
