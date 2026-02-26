'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAegisStore } from '@/store/aegis'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Bell, RefreshCcw, Search as SearchIcon, UserCircle2, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { tenantId, role, autoRefresh } = useAegisStore((s) => ({
    tenantId: s.session.tenantId,
    role: s.session.role,
    autoRefresh: s.session.autoRefresh
  }))
  const threatLevel = useAegisStore((s) => s.threatLevel)
  const kpis = useAegisStore((s) => s.selectors.kpis())
  const tenants = useAegisStore((s) => s.selectors.tenants())
  const notifications = useAegisStore((s) => s.notifications)
  const actions = useAegisStore((s) => s.actions)

  const [q, setQ] = useState('')

  useEffect(() => {
    const t = setInterval(() => actions.simulateRefreshTick(), 7000)
    return () => clearInterval(t)
  }, [actions])

  const threatBadge = useMemo(() => {
    if (threatLevel === 'Critical') return { variant: 'critical' as const, label: 'Critical' }
    if (threatLevel === 'High') return { variant: 'high' as const, label: 'High' }
    if (threatLevel === 'Medium') return { variant: 'medium' as const, label: 'Medium' }
    return { variant: 'low' as const, label: 'Low' }
  }, [threatLevel])

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative max-w-[560px] w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search alerts, IOCs, users…"
              className="pl-9"
            />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Threat</div>
              <Badge variant={threatBadge.variant}>{threatBadge.label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Active alerts</div>
              <Badge variant="outline">{kpis.activeAlerts}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <RefreshCcw className={cn('h-4 w-4 text-muted-foreground', autoRefresh && 'animate-spin')} />
            <div className="text-xs text-muted-foreground">Auto-refresh</div>
            <Switch checked={autoRefresh} onCheckedChange={() => actions.toggleAutoRefresh()} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <span className="hidden sm:inline">Tenant</span>
                <span className="text-foreground/90">{tenantId}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants.map((t) => (
                <DropdownMenuItem key={t.id} onClick={() => actions.setTenant(t.id)}>
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <span className="hidden sm:inline">Role</span>
                <span className="text-foreground/90">{role}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Role Switcher</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.setRole('SOC_ANALYST')}>SOC Analyst</DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.setRole('CISO')}>CISO</DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.setRole('EXECUTIVE')}>Executive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[340px] overflow-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="px-2 py-2">
                    <div className="text-sm">{n.text}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(n.ts).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="User menu">
                <UserCircle2 className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Analyst Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.pushNote('Profile', 'Profile actions are mocked in this demo.')}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.pushNote('Security', 'MFA + SSO configuration is mocked in this demo.')}>Security</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.pushNote('Signed out', 'Sign-out is a mock action in this demo.')}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {q.length > 0 ? (
        <div className="px-6 pb-4">
          <SearchResults query={q} />
        </div>
      ) : null}
    </header>
  )
}

function SearchResults({ query }: { query: string }) {
  const q = query.toLowerCase()
  const alerts = useAegisStore((s) => s.selectors.alerts())
  const incidents = useAegisStore((s) => s.selectors.incidents())

  const matches = {
    alerts: alerts.filter((a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)).slice(0, 3),
    incidents: incidents.filter((i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)).slice(0, 3)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-muted-foreground">Global search results</div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium">Alerts</div>
          <div className="mt-2 space-y-2">
            {matches.alerts.length === 0 ? <div className="text-sm text-muted-foreground">No matches</div> : null}
            {matches.alerts.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.id} • {a.severity} • {a.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Incidents</div>
          <div className="mt-2 space-y-2">
            {matches.incidents.length === 0 ? <div className="text-sm text-muted-foreground">No matches</div> : null}
            {matches.incidents.map((i) => (
              <div key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-medium">{i.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{i.id} • {i.severity} • {i.playbookStage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
