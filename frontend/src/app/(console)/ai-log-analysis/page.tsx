'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { AiLogAnalyzer } from '@/components/soc/modules/ai-log-analyzer'

export default function AiLogAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">FastAPI-backed parsing + simulated LLM narrative</div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Log Analysis Engine</h1>
      </div>

      <GlassCard title="Upload & Parse Logs" subtitle="Generate structured events, alerts, and an incident report">
        <AiLogAnalyzer />
      </GlassCard>
    </div>
  )
}
