'use client'

import { AlertsTable } from '@/components/soc/modules/alerts-table'
import { GlassCard } from '@/components/soc/glass-card'

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">SIEM Simulation</div>
        <h1 className="text-2xl font-semibold tracking-tight">Alert Management</h1>
      </div>

      <GlassCard title="Real-time Alerts" subtitle="Filters, lifecycle actions, enrichment + AI summary">
        <AlertsTable />
      </GlassCard>
    </div>
  )
}
