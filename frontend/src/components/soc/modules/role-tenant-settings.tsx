'use client'

import { useAegisStore } from '@/store/aegis'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NAV } from '@/components/soc/nav'

export function RoleTenantSettings() {
  const { tenantId, role } = useAegisStore((s) => ({ tenantId: s.session.tenantId, role: s.session.role }))
  const tenants = useAegisStore((s) => s.selectors.tenants())
  const actions = useAegisStore((s) => s.actions)

  const visible = NAV.filter((n) => n.roles.includes(role))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Tenant</div>
          <div className="mt-2 text-xs text-muted-foreground">Multi-tenant ready store (tenantId scoped data).</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tenants.map((t) => (
              <Button key={t.id} variant={t.id === tenantId ? 'default' : 'secondary'} size="sm" onClick={() => actions.setTenant(t.id)}>
                {t.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Role</div>
          <div className="mt-2 text-xs text-muted-foreground">Role-based module access and UI filtering.</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant={role === 'SOC_ANALYST' ? 'default' : 'secondary'} size="sm" onClick={() => actions.setRole('SOC_ANALYST')}>
              SOC Analyst
            </Button>
            <Button variant={role === 'CISO' ? 'default' : 'secondary'} size="sm" onClick={() => actions.setRole('CISO')}>
              CISO
            </Button>
            <Button variant={role === 'EXECUTIVE' ? 'default' : 'secondary'} size="sm" onClick={() => actions.setRole('EXECUTIVE')}>
              Executive
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-muted-foreground">
            Current: <span className="text-foreground/90">{role}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Visible Modules</div>
            <div className="mt-1 text-xs text-muted-foreground">Computed from RBAC policy map.</div>
          </div>
          <Badge variant="outline">{visible.length} items</Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {visible.map((v) => (
            <div key={v.label} className="rounded-xl border border-white/10 bg-black/15 p-3">
              <div className="text-sm font-medium">{v.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{v.href}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
