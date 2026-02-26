'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { ComplianceCenter } from '@/components/soc/modules/compliance-center'

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">Basel III • IFRS 9 • ESG</div>
        <h1 className="text-2xl font-semibold tracking-tight">Compliance & Risk Center</h1>
      </div>

      <GlassCard title="Compliance Overview" subtitle="Control coverage, evidence checklist, AI risk narrative">
        <ComplianceCenter />
      </GlassCard>
    </div>
  )
}
