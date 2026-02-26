'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { GlobalThreatLandscape } from '@/components/soc/modules/threat-landscape'

export default function ThreatLandscapePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">Geospatial simulation • Auto-refresh • Attack-type filters</div>
        <h1 className="text-2xl font-semibold tracking-tight">Global Threat Landscape</h1>
      </div>

      <GlobalThreatLandscape />

      <GlassCard title="Active Regions" subtitle="Country-based incident visualization (mock)">
        <div className="text-sm text-muted-foreground">
          For a lightweight demo (no mapbox dependency), the interactive map is represented by a stylized grid + region drilldown.
          Swap this module with Mapbox GL / Deck.gl in production.
        </div>
      </GlassCard>
    </div>
  )
}
