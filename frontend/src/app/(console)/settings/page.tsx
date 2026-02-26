'use client'

import { GlassCard } from '@/components/soc/glass-card'
import { RoleTenantSettings } from '@/components/soc/modules/role-tenant-settings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">RBAC + tenancy</div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </div>

      <GlassCard title="Role & Tenant" subtitle="UI dynamically filters modules based on role">
        <RoleTenantSettings />
      </GlassCard>
    </div>
  )
}
