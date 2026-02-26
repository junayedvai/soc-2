'use client'

import { useMemo } from 'react'
import { useAegisStore } from '@/store/aegis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Download, TrendingUp, ShieldCheck } from 'lucide-react'

export function ExecutiveCenter() {
  const kpis = useAegisStore((s) => s.selectors.kpis())
  const trend = useAegisStore((s) => s.selectors.severityTrend())
  const role = useAegisStore((s) => s.session.role)

  const exposure = useMemo(() => Math.min(100, Math.round(kpis.globalThreatScore * 0.85 + (100 - kpis.complianceScore) * 0.4)), [kpis])
  const impact = useMemo(() => {
    const base = 250000
    return Math.round(base + kpis.activeIncidents * 180000 + kpis.activeAlerts * 12000)
  }, [kpis.activeIncidents, kpis.activeAlerts])

  function download() {
    const content = [
      'AegisX – Board Report (Mock)',
      `Generated: ${new Date().toLocaleString()}`,
      `Role: ${role}`,
      '',
      `Risk exposure score: ${exposure}/100`,
      `Global threat score: ${kpis.globalThreatScore}/100`,
      `Compliance score: ${kpis.complianceScore}%`,
      `Active incidents: ${kpis.activeIncidents}`,
      `Active alerts: ${kpis.activeAlerts}`,
      '',
      'Narrative:',
      'The organization is experiencing elevated authentication and endpoint signals. Priority actions include containment via SOAR playbooks and closure of compliance evidence gaps for model access reviews.',
      '',
      'This export is a demo artifact. In production, generate PDF with signed attestations and audit trail links.'
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aegisx-board-report-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Risk Exposure" value={`${exposure}/100`} icon={<TrendingUp className="h-4 w-4" />} badgeVariant={exposure > 75 ? 'high' : exposure > 55 ? 'medium' : 'low'} />
        <Stat title="Financial Impact" value={`$${impact.toLocaleString()}`} icon={<ShieldCheck className="h-4 w-4" />} badgeVariant={impact > 800000 ? 'high' : impact > 500000 ? 'medium' : 'low'} />
        <Stat title="Compliance Maturity" value={`${kpis.complianceScore}%`} icon={<ShieldCheck className="h-4 w-4" />} badgeVariant={kpis.complianceScore > 80 ? 'low' : kpis.complianceScore > 65 ? 'medium' : 'high'} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Incident Trend (Mock)</div>
            <div className="mt-1 text-xs text-muted-foreground">Severity signal over time for executive visibility</div>
          </div>
          <Button onClick={download}>
            <Download className="h-4 w-4" /> Download board report
          </Button>
        </div>

        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="ts" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="Critical" stroke="#f87171" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="High" stroke="#fb923c" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="Medium" stroke="#22d3ee" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
        This Executive Command Center is role-filtered. The CISO role sees both compliance and incident posture; Executive role is read-only and report-centric.
      </div>
    </div>
  )
}

function Stat({
  title,
  value,
  icon,
  badgeVariant
}: {
  title: string
  value: string
  icon: React.ReactNode
  badgeVariant: any
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{title}</div>
        <Badge variant={badgeVariant}>{icon}</Badge>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
