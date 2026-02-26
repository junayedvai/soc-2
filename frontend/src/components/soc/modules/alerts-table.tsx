'use client'

import { useMemo, useState } from 'react'
import type { Alert, Severity } from '@/types/domain'
import { useAegisStore } from '@/store/aegis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Check, CornerUpRight, FilePlus2, UserPlus } from 'lucide-react'

const sevOrder: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

export function AlertsTable() {
  const alerts = useAegisStore((s) => s.selectors.alerts())
  const actions = useAegisStore((s) => s.actions)

  const [filter, setFilter] = useState<'All' | Severity>('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Alert | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return alerts
      .filter((a) => (filter === 'All' ? true : a.severity === filter))
      .filter((a) => (q ? a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) : true))
      .sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity])
  }, [alerts, filter, search])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Critical">Critical</TabsTrigger>
              <TabsTrigger value="High">High</TabsTrigger>
              <TabsTrigger value="Medium">Medium</TabsTrigger>
              <TabsTrigger value="Low">Low</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full sm:w-[320px]">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by alert ID/title…" />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
            <div className="col-span-4">Alert</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-2">Severity</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/10">
            {filtered.map((a) => (
              <div
                key={a.id}
                className={cn('grid grid-cols-12 px-4 py-3 bg-black/10 hover:bg-white/5 cursor-pointer', selected?.id === a.id && 'bg-white/6')}
                onClick={() => setSelected(a)}
              >
                <div className="col-span-4">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.id} • {new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="col-span-2 text-sm text-foreground/90">{a.source}</div>
                <div className="col-span-2">
                  <SeverityBadge severity={a.severity} />
                </div>
                <div className="col-span-2">
                  <Badge variant="outline">{a.status}</Badge>
                  {a.assignee ? <div className="mt-1 text-[11px] text-muted-foreground">@{a.assignee}</div> : null}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" aria-label="Acknowledge" onClick={() => actions.acknowledgeAlert(a.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Assign" onClick={() => actions.assignAlert(a.id, 'analyst-1')}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Escalate" onClick={() => actions.escalateAlert(a.id)}>
                    <CornerUpRight className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Create case" onClick={() => actions.createIncidentFromAlert(a.id)}>
                    <FilePlus2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Tip: lifecycle actions update KPIs and incident queue in real-time.
        </div>
      </div>

      <div className="xl:col-span-5">
        {selected ? (
          <AlertDetail alertId={selected.id} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-muted-foreground">
            Select an alert to view full details, MITRE mapping, enrichment, and AI summary.
          </div>
        )}
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const v = severity === 'Critical' ? 'critical' : severity === 'High' ? 'high' : severity === 'Medium' ? 'medium' : 'low'
  return <Badge variant={v as any}>{severity}</Badge>
}

function AlertDetail({ alertId }: { alertId: string }) {
  const alert = useAegisStore((s) => s.selectors.alerts().find((a) => a.id === alertId))
  const actions = useAegisStore((s) => s.actions)
  if (!alert) return null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{alert.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{alert.id} • {alert.source} • {new Date(alert.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            <Badge variant="outline">{alert.status}</Badge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="text-xs text-muted-foreground">User</div>
            <div className="text-sm mt-1">{alert.user ?? '—'}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="text-xs text-muted-foreground">IP</div>
            <div className="text-sm mt-1">{alert.ip ?? '—'}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => actions.acknowledgeAlert(alert.id)}>
            <Check className="h-4 w-4" /> Acknowledge
          </Button>
          <Button variant="secondary" size="sm" onClick={() => actions.assignAlert(alert.id, 'analyst-1')}>
            <UserPlus className="h-4 w-4" /> Assign
          </Button>
          <Button variant="secondary" size="sm" onClick={() => actions.escalateAlert(alert.id)}>
            <ArrowUpRight className="h-4 w-4" /> Escalate
          </Button>
          <Button size="sm" onClick={() => actions.createIncidentFromAlert(alert.id)}>
            <FilePlus2 className="h-4 w-4" /> Create Case
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">AI Summary</div>
        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{alert.aiSummary ?? 'No AI summary available.'}</div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">MITRE ATT&CK Mapping</div>
        <div className="mt-3 space-y-2">
          {(alert.mitre ?? []).map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-3 py-2">
              <div className="text-sm">{m.tactic} • {m.technique}</div>
              <Badge variant="outline">{m.id}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Enrichment</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(alert.enrichment ?? {}).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/10 bg-black/15 p-3">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="text-sm mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Timeline</div>
        <div className="mt-3 space-y-2">
          {alert.timeline.map((t, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-black/15 px-3 py-2">
              <div className="text-xs text-muted-foreground">{new Date(t.ts).toLocaleString()}</div>
              <div className="text-sm">{t.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Raw Log</div>
        <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground rounded-xl border border-white/10 bg-black/20 p-3">
{alert.rawLog}
        </pre>
      </div>
    </div>
  )
}
