'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { useAegisStore } from '@/store/aegis'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'

const palette = ['#8b5cf6', '#22d3ee', '#fb923c', '#34d399', '#f87171']

export function DashboardCharts() {
  const dist = useAegisStore((s) => s.selectors.severityDistribution())
  const trend = useAegisStore((s) => s.selectors.severityTrend())
  const response = useAegisStore((s) => s.selectors.responseStatus())
  const heat = useAegisStore((s) => s.selectors.riskHeatmap())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard title="Alert Severity" subtitle="Active alerts by severity">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {dist.map((_, idx) => (
                  <Cell key={idx} fill={palette[idx % palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(10,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Response Status" subtitle="Lifecycle distribution">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={response} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {response.map((_, idx) => (
                  <Cell key={idx} fill={palette[idx % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Severity Trend" subtitle="12-tick severity signal">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="ts" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="Critical" stroke={palette[4]} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="High" stroke={palette[2]} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="Medium" stroke={palette[1]} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="Low" stroke={palette[3]} dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Risk Heat" subtitle="Compliance gaps by domain">
        <div className="space-y-3">
          {heat.map((h) => (
            <div key={h.domain} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{h.domain}</div>
                <div className="text-xs text-muted-foreground">Risk {h.risk}/100</div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${Math.min(100, h.risk)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
