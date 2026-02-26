'use client'

import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '@/components/soc/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAegisStore } from '@/store/aegis'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Globe2, Radar } from 'lucide-react'

type Attack = 'DDoS' | 'Phishing' | 'Malware' | 'APT'

type RegionStat = { country: string; score: number; incidents: number; attack: Attack }

const countries = ['BD', 'DE', 'US', 'GB', 'AE', 'SG', 'IN', 'JP', 'AU', 'FR', 'BR', 'ZA']

function synth(attack: Attack): RegionStat[] {
  return countries
    .map((c) => ({
      country: c,
      attack,
      incidents: Math.max(0, Math.round(6 + Math.random() * 22 + (attack === 'APT' ? 10 : 0))),
      score: Math.max(0, Math.round(20 + Math.random() * 70 + (attack === 'APT' ? 12 : 0)))
    }))
    .sort((a, b) => b.score - a.score)
}

export function GlobalThreatLandscape() {
  const autoRefresh = useAegisStore((s) => s.session.autoRefresh)

  const [attack, setAttack] = useState<Attack>('Malware')
  const [data, setData] = useState<RegionStat[]>(() => synth('Malware'))

  useEffect(() => {
    setData(synth(attack))
  }, [attack])

  useEffect(() => {
    if (!autoRefresh) return
    const t = setInterval(() => setData(synth(attack)), 9000)
    return () => clearInterval(t)
  }, [autoRefresh, attack])

  const top = data[0]
  const avg = useMemo(() => Math.round(data.reduce((a, b) => a + b.score, 0) / Math.max(1, data.length)), [data])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8">
        <GlassCard
          title="Threat Map (Simulated)"
          subtitle="Country-based incidents with attack-type filter"
          right={
            <div className="flex items-center gap-2">
              <Badge variant="outline">Avg score {avg}</Badge>
              {top ? <Badge variant="high">Top {top.country}: {top.score}</Badge> : null}
            </div>
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={attack} onValueChange={(v) => setAttack(v as Attack)}>
              <TabsList>
                <TabsTrigger value="DDoS">DDoS</TabsTrigger>
                <TabsTrigger value="Phishing">Phishing</TabsTrigger>
                <TabsTrigger value="Malware">Malware</TabsTrigger>
                <TabsTrigger value="APT">APT</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="secondary" onClick={() => setData(synth(attack))}>
              <Radar className="h-4 w-4" /> Refresh snapshot
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7">
              <div className="h-[320px] rounded-2xl border border-white/10 bg-black/10 p-3">
                <div className="h-full rounded-xl border border-white/10 bg-black/20">
                  <div className="grid grid-cols-6 gap-2 p-4">
                    {data.slice(0, 12).map((r) => (
                      <button
                        key={r.country}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 text-left"
                        title={`${r.country} – score ${r.score}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">{r.country}</div>
                          <div className="text-xs text-muted-foreground">{r.incidents}</div>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${r.score}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 pb-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Globe2 className="h-4 w-4" /> Clickable region tiles simulate a real threat map layer.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.slice(0, 8)} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="country" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(10,12,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} fill="#22d3ee" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="xl:col-span-4">
        <GlassCard title="Active Regions" subtitle="Operational focus (mock)">
          <div className="space-y-3">
            {data.slice(0, 6).map((r) => (
              <div key={r.country} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{r.country}</div>
                  <Badge variant={r.score > 75 ? 'high' : r.score > 55 ? 'medium' : 'low'}>{r.score}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{r.attack} • {r.incidents} incidents</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
