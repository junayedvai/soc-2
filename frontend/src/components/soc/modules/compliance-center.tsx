'use client'

import { useMemo, useState } from 'react'
import { useAegisStore } from '@/store/aegis'
import type { ComplianceFramework } from '@/types/domain'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCheck2, Sparkles, ClipboardList } from 'lucide-react'

export function ComplianceCenter() {
  const controls = useAegisStore((s) => s.selectors.compliance())
  const pushNote = useAegisStore((s) => s.actions.pushNote)

  const [fw, setFw] = useState<ComplianceFramework>('Basel III')

  const filtered = useMemo(() => controls.filter((c) => c.framework === fw), [controls, fw])
  const score = useMemo(() => {
    if (filtered.length === 0) return 0
    return Math.round(filtered.reduce((a, b) => a + b.coveragePct, 0) / filtered.length)
  }, [filtered])

  const gaps = useMemo(
    () => filtered.flatMap((c) => c.evidence.filter((e) => e.status === 'Missing').map((e) => ({ control: c.control, evidence: e.title }))).slice(0, 4),
    [filtered]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={fw} onValueChange={(v) => setFw(v as ComplianceFramework)}>
          <TabsList>
            <TabsTrigger value="Basel III">Basel III</TabsTrigger>
            <TabsTrigger value="IFRS 9">IFRS 9</TabsTrigger>
            <TabsTrigger value="ESG">ESG</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Badge variant={score > 80 ? 'low' : score > 65 ? 'medium' : 'high'}>Coverage {score}%</Badge>
          <Button variant="secondary" onClick={() => pushNote('AI Risk Summary', `Generated compliance narrative for ${fw}.`)}>
            <Sparkles className="h-4 w-4" /> AI summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-12 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
              <div className="col-span-3">Domain</div>
              <div className="col-span-5">Control</div>
              <div className="col-span-2">Coverage</div>
              <div className="col-span-2">Audit</div>
            </div>
            <div className="divide-y divide-white/10">
              {filtered.map((c) => (
                <div key={c.id} className="grid grid-cols-12 px-4 py-3 bg-black/10">
                  <div className="col-span-3 text-sm font-medium">{c.domain}</div>
                  <div className="col-span-5 text-sm text-muted-foreground">{c.control}</div>
                  <div className="col-span-2">
                    <Badge variant={c.coveragePct > 80 ? 'low' : c.coveragePct > 65 ? 'medium' : 'high'}>{c.coveragePct}%</Badge>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">{c.lastAuditEvent}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4" /> Evidence Checklist</div>
            <div className="mt-3 space-y-2">
              {filtered.flatMap((c) => c.evidence.map((e) => ({ ...e, control: c.control }))).slice(0, 7).map((e) => (
                <div key={e.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{e.title}</div>
                    <Badge variant={e.status === 'Accepted' ? 'low' : e.status === 'In Review' ? 'medium' : 'high'}>{e.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Control: {e.control}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><FileCheck2 className="h-4 w-4" /> AI Risk Narrative</div>
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {gaps.length === 0
                ? `Coverage is strong for ${fw}. Continue evidence collection and automate quarterly audit exports.`
                : `Primary gaps for ${fw}: ${gaps.map((g) => g.evidence).join(', ')}. Focus on closing missing evidence and linking SOAR telemetry to control validation.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
