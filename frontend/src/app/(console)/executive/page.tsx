'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { ExecutiveCenter } from '@/components/soc/modules/executive-center'

export default function ExecutivePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">C-level view</div>
        <h1 className="text-2xl font-semibold tracking-tight">Executive Command Center</h1>
      </div>

      <GlassCard title="Board-Ready KPIs" subtitle="Risk exposure, financial impact, trends, maturity gauge">
        <ExecutiveCenter />
      </GlassCard>
    </div>
  )
}
