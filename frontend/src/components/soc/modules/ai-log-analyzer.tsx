'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAegisStore } from '@/store/aegis'
import { FileUp, Sparkles, FileText, Loader2 } from 'lucide-react'

type ParsedEvent = {
  ts: string
  category: string
  user?: string
  ip?: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  message: string
}

type ParseResponse = { events: ParsedEvent[]; ai_explanation: string }

type GenerateAlertResponse = {
  alert: {
    title: string
    severity: ParsedEvent['severity']
    source: 'Auth' | 'EDR' | 'NDR' | 'Cloud' | 'WAF'
    rawLog: string
    user?: string
    ip?: string
    aiSummary: string
  }
}

export function AiLogAnalyzer() {
  const tenantId = useAegisStore((s) => s.session.tenantId)
  const pushNote = useAegisStore((s) => s.actions.pushNote)

  const [text, setText] = useState(
    `Feb 26 09:12:32 authd[8123]: Failed password for admin from 185.199.110.153 port 53211 ssh2\nFeb 26 09:12:36 authd[8123]: Failed password for admin from 185.199.110.153 port 53218 ssh2\nFeb 26 09:12:40 authd[8123]: Failed password for admin from 185.199.110.153 port 53225 ssh2\nFeb 26 09:13:02 authd[8123]: Accepted password for admin from 185.199.110.153 port 53301 ssh2`
  )
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [parsed, setParsed] = useState<ParseResponse | null>(null)
  const [gen, setGen] = useState<GenerateAlertResponse | null>(null)

  const parsedCritical = useMemo(() => parsed?.events.filter((e) => e.severity === 'Critical').length ?? 0, [parsed])

  async function parse() {
    setBusy(true)
    setGen(null)
    try {
      let bodyText = text
      if (file) bodyText = await file.text()

      const res = await fetch('/api/logs/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, raw: bodyText })
      })
      if (!res.ok) throw new Error(`parse failed (${res.status})`)
      const data = (await res.json()) as ParseResponse
      setParsed(data)
      pushNote('Logs parsed', `Parsed ${data.events.length} events for ${tenantId}.`) 
    } catch (e) {
      // fallback mock if backend not running
      const mock: ParseResponse = {
        events: [
          { ts: new Date().toISOString(), category: 'Brute Force', user: 'admin', ip: '185.199.110.153', severity: 'Critical', message: 'Repeated failed logins detected.' },
          { ts: new Date().toISOString(), category: 'Suspicious Login', user: 'admin', ip: '185.199.110.153', severity: 'High', message: 'Successful login after failures.' }
        ],
        ai_explanation:
          'Pattern indicates brute force attempts followed by successful authentication. Validate MFA, rotate credentials, and review lateral movement indicators.'
      }
      setParsed(mock)
      pushNote('Backend offline', 'Using local mock parsing results.')
    } finally {
      setBusy(false)
    }
  }

  async function generateAlert() {
    setBusy(true)
    try {
      const raw = file ? await file.text() : text
      const res = await fetch('/api/alerts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, raw })
      })
      if (!res.ok) throw new Error(`generate failed (${res.status})`)
      const data = (await res.json()) as GenerateAlertResponse
      setGen(data)
      pushNote('Alert generated', `AI generated an alert: ${data.alert.title}`)
    } catch (e) {
      const mock: GenerateAlertResponse = {
        alert: {
          title: 'AI-generated: Privileged brute force + suspicious success',
          severity: 'Critical',
          source: 'Auth',
          rawLog: file ? '(file)' : '(text)',
          user: 'admin',
          ip: '185.199.110.153',
          aiSummary:
            'Detected repeated failed SSH logins followed by successful authentication for a privileged account. Recommend blocking the source IP, forcing credential rotation, and initiating incident response playbook.'
        }
      }
      setGen(mock)
      pushNote('Backend offline', 'Using local mock alert generation.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paste authentication/system logs here…"
          />
        </div>
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Upload</div>
            <div className="mt-2 text-xs text-muted-foreground">Optional file upload (overrides pasted logs).</div>
            <div className="mt-3">
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={parse} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} Parse
              </Button>
              <Button onClick={generateAlert} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate Alert
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Signal Summary</div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Parsed events</div>
              <Badge variant="outline">{parsed?.events.length ?? 0}</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Critical flags</div>
              <Badge variant={parsedCritical > 0 ? 'critical' : 'outline'}>{parsedCritical}</Badge>
            </div>
          </div>
        </div>
      </div>

      {parsed ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Parsed Events</div>
            <Badge variant="outline">tenant: {tenantId}</Badge>
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-12 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
              <div className="col-span-2">Severity</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">IP</div>
              <div className="col-span-3">Message</div>
            </div>
            <div className="divide-y divide-white/10">
              {parsed.events.map((e, idx) => (
                <div key={idx} className="grid grid-cols-12 px-4 py-3 bg-black/10">
                  <div className="col-span-2"><Badge variant={sevToVariant(e.severity)}>{e.severity}</Badge></div>
                  <div className="col-span-3 text-sm">{e.category}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{e.user ?? '—'}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{e.ip ?? '—'}</div>
                  <div className="col-span-3 text-sm text-muted-foreground">{e.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4" /> AI Explanation</div>
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{parsed.ai_explanation}</div>
          </div>
        </div>
      ) : null}

      {gen ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Generated Alert Preview</div>
          <div className="mt-2 text-xs text-muted-foreground">This is returned by FastAPI (or a mock fallback) and can be wired into the Alert Management store in production.</div>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{gen.alert.title}</div>
              <Badge variant={sevToVariant(gen.alert.severity)}>{gen.alert.severity}</Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{gen.alert.aiSummary}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function sevToVariant(sev: ParsedEvent['severity']) {
  return sev === 'Critical' ? 'critical' : sev === 'High' ? 'high' : sev === 'Medium' ? 'medium' : 'low'
}
