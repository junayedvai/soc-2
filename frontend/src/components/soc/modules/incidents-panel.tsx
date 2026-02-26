'use client'

import { useMemo, useState } from 'react'
import type { Incident } from '@/types/domain'
import { useAegisStore } from '@/store/aegis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ShieldBan, UserMinus, Biohazard, Play, CheckCircle2 } from 'lucide-react'

const stages: Incident['playbookStage'][] = ['Detect', 'Enrich', 'Contain', 'Recover', 'Close']

export function IncidentsPanel() {
  const incidents = useAegisStore((s) => s.selectors.incidents())
  const [selectedId, setSelectedId] = useState<string | null>(incidents[0]?.id ?? null)

  const selected = useMemo(() => incidents.find((i) => i.id === selectedId) ?? null, [incidents, selectedId])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-5">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="bg-white/5 px-4 py-2 text-xs text-muted-foreground">Incident Queue</div>
          <div className="divide-y divide-white/10">
            {incidents.map((i) => (
              <div
                key={i.id}
                className={cn('px-4 py-3 bg-black/10 hover:bg-white/5 cursor-pointer', selectedId === i.id && 'bg-white/6')}
                onClick={() => setSelectedId(i.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{i.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{i.id} • {new Date(i.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <Severity severity={i.severity} />
                    <div className="mt-1 text-[11px] text-muted-foreground">Stage: {i.playbookStage}</div>
                  </div>
                </div>
              </div>
            ))}
            {incidents.length === 0 ? (
              <div className="px-4 py-8 text-sm text-muted-foreground">No incidents yet. Create cases from the Alerts module.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="xl:col-span-7">
        {selected ? <IncidentDetail incident={selected} /> : <Empty />}
      </div>
    </div>
  )
}

function Empty() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-muted-foreground">
      Select an incident to run playbooks, view history, and simulate SOAR containment actions.
    </div>
  )
}

function Severity({ severity }: { severity: Incident['severity'] }) {
  const v = severity === 'Critical' ? 'critical' : severity === 'High' ? 'high' : severity === 'Medium' ? 'medium' : 'low'
  return <Badge variant={v as any}>{severity}</Badge>
}

function IncidentDetail({ incident }: { incident: Incident }) {
  const actions = useAegisStore((s) => s.actions)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{incident.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{incident.id} • Related alerts: {incident.relatedAlertIds.join(', ')}</div>
          </div>
          <div className="flex items-center gap-2">
            <Severity severity={incident.severity} />
            <Badge variant="outline">{incident.status}</Badge>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted-foreground">Playbook execution</div>
          <Tabs value={incident.playbookStage} onValueChange={(v) => actions.setIncidentStage(incident.id, v as any)}>
            <TabsList className="mt-2">
              {stages.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {s}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="secondary"
              onClick={() => actions.executeIncidentAction(incident.id, 'BlockIP', 'Blocked 185.199.110.153 at edge firewall (simulated).')}
            >
              <ShieldBan className="h-4 w-4" /> Block IP
            </Button>
            <Button
              variant="secondary"
              onClick={() => actions.executeIncidentAction(incident.id, 'DisableUser', 'Disabled user admin in IAM (simulated).')}
            >
              <UserMinus className="h-4 w-4" /> Disable User
            </Button>
            <Button
              variant="secondary"
              onClick={() => actions.executeIncidentAction(incident.id, 'QuarantineHost', 'Quarantined host linux-bastion-02 in EDR (simulated).')}
            >
              <Biohazard className="h-4 w-4" /> Quarantine Host
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">AI Incident Summary</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => actions.pushNote('AI Summary', `Refreshed incident narrative for ${incident.id}.`)}
              >
                <Play className="h-4 w-4" /> Refresh
              </Button>
            </div>
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{incident.aiSummary ?? 'No AI summary available.'}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Execution History</div>
        <div className="mt-3 space-y-2">
          {incident.actions.map((a, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2">
              <div>
                <div className="text-sm">{a.type}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.detail}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{new Date(a.ts).toLocaleString()} • actor: {a.actor}</div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={cn('h-4 w-4', a.success ? 'text-emerald-300' : 'text-red-300')} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
