'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Alert, ComplianceControl, CommandNote, Incident, Role, ThreatLevel } from '@/types/domain'
import { seedAlerts, seedCompliance, seedIncidents, seedNotes, tenants } from '@/mock/seed'

type SessionState = {
  tenantId: string
  role: Role
  autoRefresh: boolean
}

type AegisState = {
  session: SessionState
  threatLevel: ThreatLevel
  notifications: { id: string; text: string; ts: string }[]

  alertsByTenant: Record<string, Alert[]>
  incidentsByTenant: Record<string, Incident[]>
  complianceByTenant: Record<string, ComplianceControl[]>
  notesByTenant: Record<string, CommandNote[]>

  actions: {
    setRole: (role: Role) => void
    setTenant: (tenantId: string) => void
    toggleAutoRefresh: () => void
    setThreatLevel: (level: ThreatLevel) => void

    acknowledgeAlert: (alertId: string) => void
    assignAlert: (alertId: string, assignee: string) => void
    escalateAlert: (alertId: string) => void
    closeAlert: (alertId: string) => void

    createIncidentFromAlert: (alertId: string) => void
    setIncidentStage: (incidentId: string, stage: Incident['playbookStage']) => void
    executeIncidentAction: (incidentId: string, type: Incident['actions'][number]['type'], detail: string) => void

    pushNote: (title: string, body: string) => void
    simulateRefreshTick: () => void
  }

  selectors: {
    tenants: () => { id: string; name: string }[]
    alerts: () => Alert[]
    incidents: () => Incident[]
    compliance: () => ComplianceControl[]
    commandNotes: () => CommandNote[]

    kpis: () => {
      totalAlerts: number
      activeIncidents: number
      complianceScore: number
      activeAgents: number
      globalThreatScore: number
      activeAlerts: number
    }

    severityDistribution: () => { name: string; value: number }[]
    severityTrend: () => { ts: string; Critical: number; High: number; Medium: number; Low: number }[]
    responseStatus: () => { name: string; value: number }[]
    riskHeatmap: () => { domain: string; risk: number }[]
  }
}

function uid(prefix = 'N') {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function calcThreatLevel(alerts: Alert[], incidents: Incident[]): ThreatLevel {
  const score =
    alerts.reduce((acc, a) =>
      acc + (a.severity === 'Critical' ? 18 : a.severity === 'High' ? 10 : a.severity === 'Medium' ? 5 : 2), 0
    ) + incidents.reduce((acc, i) => acc + (i.severity === 'Critical' ? 30 : i.severity === 'High' ? 18 : 8), 0)

  if (score >= 120) return 'Critical'
  if (score >= 70) return 'High'
  if (score >= 35) return 'Medium'
  return 'Low'
}

function getTenantSlice<T>(record: Record<string, T[]>, tenantId: string): T[] {
  return record[tenantId] ?? []
}

export const useAegisStore = create<AegisState>()(
  persist(
    (set, get) => {
      const initialTenant = tenants[0].id
      return {
        session: { tenantId: initialTenant, role: 'SOC_ANALYST', autoRefresh: true },
        threatLevel: 'Medium',
        notifications: [{ id: uid('NT'), text: 'Welcome to AegisX Command Center.', ts: new Date().toISOString() }],

        alertsByTenant: {
          [initialTenant]: seedAlerts(initialTenant),
          [tenants[1].id]: seedAlerts(tenants[1].id),
          [tenants[2].id]: seedAlerts(tenants[2].id)
        },
        incidentsByTenant: {
          [initialTenant]: seedIncidents(initialTenant),
          [tenants[1].id]: seedIncidents(tenants[1].id),
          [tenants[2].id]: []
        },
        complianceByTenant: {
          [initialTenant]: seedCompliance(initialTenant),
          [tenants[1].id]: seedCompliance(tenants[1].id),
          [tenants[2].id]: seedCompliance(tenants[2].id)
        },
        notesByTenant: {
          [initialTenant]: seedNotes(initialTenant),
          [tenants[1].id]: seedNotes(tenants[1].id),
          [tenants[2].id]: seedNotes(tenants[2].id)
        },

        actions: {
          setRole: (role) => set((s) => ({ session: { ...s.session, role } })),
          setTenant: (tenantId) =>
            set((s) => ({
              session: { ...s.session, tenantId },
              threatLevel: calcThreatLevel(getTenantSlice(s.alertsByTenant, tenantId), getTenantSlice(s.incidentsByTenant, tenantId))
            })),
          toggleAutoRefresh: () => set((s) => ({ session: { ...s.session, autoRefresh: !s.session.autoRefresh } })),
          setThreatLevel: (level) => set(() => ({ threatLevel: level })),

          acknowledgeAlert: (alertId) => {
            const { session, alertsByTenant } = get()
            const updated = getTenantSlice(alertsByTenant, session.tenantId).map((a) =>
              a.id === alertId ? { ...a, status: 'Acknowledged', updatedAt: new Date().toISOString() } : a
            )
            set((s) => ({
              alertsByTenant: { ...s.alertsByTenant, [session.tenantId]: updated }
            }))
            get().actions.pushNote('Alert acknowledged', `Alert ${alertId} moved to Acknowledged.`)
          },
          assignAlert: (alertId, assignee) => {
            const { session, alertsByTenant } = get()
            const updated = getTenantSlice(alertsByTenant, session.tenantId).map((a) =>
              a.id === alertId ? { ...a, status: 'Assigned', assignee, updatedAt: new Date().toISOString() } : a
            )
            set((s) => ({ alertsByTenant: { ...s.alertsByTenant, [session.tenantId]: updated } }))
            get().actions.pushNote('Alert assigned', `Alert ${alertId} assigned to ${assignee}.`)
          },
          escalateAlert: (alertId) => {
            const { session, alertsByTenant } = get()
            const updated = getTenantSlice(alertsByTenant, session.tenantId).map((a) =>
              a.id === alertId ? { ...a, status: 'Escalated', updatedAt: new Date().toISOString() } : a
            )
            set((s) => ({ alertsByTenant: { ...s.alertsByTenant, [session.tenantId]: updated } }))
            get().actions.pushNote('Alert escalated', `Alert ${alertId} escalated to incident queue.`)
          },
          closeAlert: (alertId) => {
            const { session, alertsByTenant } = get()
            const updated = getTenantSlice(alertsByTenant, session.tenantId).map((a) =>
              a.id === alertId ? { ...a, status: 'Closed', updatedAt: new Date().toISOString() } : a
            )
            set((s) => ({ alertsByTenant: { ...s.alertsByTenant, [session.tenantId]: updated } }))
            get().actions.pushNote('Alert closed', `Alert ${alertId} marked Closed.`)
          },

          createIncidentFromAlert: (alertId) => {
            const state = get()
            const { tenantId } = state.session
            const alert = getTenantSlice(state.alertsByTenant, tenantId).find((a) => a.id === alertId)
            if (!alert) return

            const incident: Incident = {
              id: `IN-${tenantId}-${Math.floor(2000 + Math.random() * 900)}`,
              tenantId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              title: `Case: ${alert.title}`,
              status: 'Open',
              severity: alert.severity,
              relatedAlertIds: [alertId],
              playbookStage: 'Detect',
              actions: [
                {
                  ts: new Date().toISOString(),
                  actor: 'analyst',
                  type: 'Note',
                  detail: `Case created from alert ${alertId}.`,
                  success: true
                }
              ],
              aiSummary:
                'Case created from alert context. Suggested next step: run Enrich stage to gather IOC reputation and user/device context.'
            }

            const updatedIncidents = [incident, ...getTenantSlice(state.incidentsByTenant, tenantId)]
            const updatedAlerts = getTenantSlice(state.alertsByTenant, tenantId).map((a) =>
              a.id === alertId ? { ...a, status: 'Escalated', updatedAt: new Date().toISOString() } : a
            )

            set((s) => ({
              incidentsByTenant: { ...s.incidentsByTenant, [tenantId]: updatedIncidents },
              alertsByTenant: { ...s.alertsByTenant, [tenantId]: updatedAlerts },
              threatLevel: calcThreatLevel(updatedAlerts, updatedIncidents)
            }))

            state.actions.pushNote('Case created', `Incident ${incident.id} created from alert ${alertId}.`)
          },

          setIncidentStage: (incidentId, stage) => {
            const state = get()
            const { tenantId } = state.session
            const incidents = getTenantSlice(state.incidentsByTenant, tenantId).map((i) => {
              if (i.id !== incidentId) return i
              const action = {
                ts: new Date().toISOString(),
                actor: 'analyst',
                type: 'StageChange' as const,
                detail: `Playbook stage set to ${stage}.`,
                success: true
              }
              return { ...i, playbookStage: stage, updatedAt: new Date().toISOString(), actions: [action, ...i.actions] }
            })
            set((s) => ({ incidentsByTenant: { ...s.incidentsByTenant, [tenantId]: incidents } }))
            state.actions.pushNote('Playbook updated', `Incident ${incidentId} moved to ${stage}.`)
          },

          executeIncidentAction: (incidentId, type, detail) => {
            const state = get()
            const { tenantId } = state.session
            const incidents = getTenantSlice(state.incidentsByTenant, tenantId).map((i) => {
              if (i.id !== incidentId) return i
              const action = {
                ts: new Date().toISOString(),
                actor: 'soar',
                type,
                detail,
                success: true
              }
              return { ...i, updatedAt: new Date().toISOString(), actions: [action, ...i.actions] }
            })
            set((s) => ({ incidentsByTenant: { ...s.incidentsByTenant, [tenantId]: incidents } }))
            state.actions.pushNote('SOAR action executed', `${type}: ${detail}`)
          },

          pushNote: (title, body) => {
            const state = get()
            const { tenantId } = state.session
            const note: CommandNote = {
              id: uid('CN'),
              tenantId,
              timestamp: new Date().toLocaleTimeString(),
              title,
              body
            }
            set((s) => ({
              notesByTenant: { ...s.notesByTenant, [tenantId]: [note, ...getTenantSlice(s.notesByTenant, tenantId)].slice(0, 6) },
              notifications: [{ id: uid('NT'), text: title, ts: new Date().toISOString() }, ...s.notifications].slice(0, 8)
            }))
          },

          simulateRefreshTick: () => {
            const state = get()
            if (!state.session.autoRefresh) return
            const { tenantId } = state.session
            const alerts = [...getTenantSlice(state.alertsByTenant, tenantId)]

            // simulate 0-1 new low/medium alerts occasionally
            if (Math.random() < 0.35) {
              const sev: Alert['severity'] = Math.random() < 0.2 ? 'High' : Math.random() < 0.55 ? 'Medium' : 'Low'
              const a: Alert = {
                id: `AL-${tenantId}-${Math.floor(1100 + Math.random() * 800)}`,
                tenantId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                title: sev === 'High' ? 'NDR anomaly spike detected' : 'Auth failure burst',
                source: sev === 'High' ? 'NDR' : 'Auth',
                severity: sev,
                status: 'New',
                ip: sev === 'High' ? '10.10.9.41' : '198.51.100.23',
                user: 'unknown',
                timeline: [{ ts: new Date().toISOString(), message: 'New alert ingested.' }],
                rawLog: 'simulated: event stream ingestion',
                mitre: [{ tactic: 'Discovery', technique: 'Network Service Scanning', id: 'T1046' }],
                enrichment: { geo: 'Unknown', reputation: 'Unrated', asset: 'edge' },
                aiSummary: 'Auto-refresh simulated new alert. Validate context and tune rules if noisy.'
              }
              alerts.unshift(a)
            }

            const incidents = getTenantSlice(state.incidentsByTenant, tenantId)
            const threatLevel = calcThreatLevel(alerts, incidents)

            set((s) => ({
              alertsByTenant: { ...s.alertsByTenant, [tenantId]: alerts.slice(0, 40) },
              threatLevel
            }))
          }
        },

        selectors: {
          tenants: () => tenants,
          alerts: () => getTenantSlice(get().alertsByTenant, get().session.tenantId),
          incidents: () => getTenantSlice(get().incidentsByTenant, get().session.tenantId),
          compliance: () => getTenantSlice(get().complianceByTenant, get().session.tenantId),
          commandNotes: () => getTenantSlice(get().notesByTenant, get().session.tenantId),

          kpis: () => {
            const alerts = get().selectors.alerts()
            const incidents = get().selectors.incidents()
            const compliance = get().selectors.compliance()

            const totalAlerts = alerts.length
            const activeAlerts = alerts.filter((a) => a.status !== 'Closed').length
            const activeIncidents = incidents.filter((i) => i.status !== 'Closed').length

            const complianceScore =
              compliance.length === 0 ? 0 : Math.round(compliance.reduce((acc, c) => acc + c.coveragePct, 0) / compliance.length)

            const critical = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Closed').length
            const high = alerts.filter((a) => a.severity === 'High' && a.status !== 'Closed').length
            const globalThreatScore = clamp(critical * 18 + high * 10 + activeIncidents * 14, 0, 100)

            return {
              totalAlerts,
              activeIncidents,
              complianceScore,
              activeAgents: 14,
              globalThreatScore,
              activeAlerts
            }
          },

          severityDistribution: () => {
            const alerts = get().selectors.alerts().filter((a) => a.status !== 'Closed')
            const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 }
            for (const a of alerts) counts[a.severity]++
            return Object.entries(counts).map(([name, value]) => ({ name, value }))
          },

          severityTrend: () => {
            // synthesize trend for last 12 ticks using distribution as baseline
            const dist = get().selectors.severityDistribution()
            const base = Object.fromEntries(dist.map((d) => [d.name, d.value])) as Record<string, number>
            const out: { ts: string; Critical: number; High: number; Medium: number; Low: number }[] = []
            for (let i = 11; i >= 0; i--) {
              const ts = new Date(Date.now() - i * 1000 * 60 * 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              out.push({
                ts,
                Critical: clamp(base.Critical + Math.round((Math.random() - 0.5) * 2), 0, 40),
                High: clamp(base.High + Math.round((Math.random() - 0.5) * 3), 0, 60),
                Medium: clamp(base.Medium + Math.round((Math.random() - 0.5) * 4), 0, 80),
                Low: clamp(base.Low + Math.round((Math.random() - 0.5) * 5), 0, 100)
              })
            }
            return out
          },

          responseStatus: () => {
            const alerts = get().selectors.alerts()
            const map = {
              New: alerts.filter((a) => a.status === 'New').length,
              Acknowledged: alerts.filter((a) => a.status === 'Acknowledged').length,
              Assigned: alerts.filter((a) => a.status === 'Assigned').length,
              Escalated: alerts.filter((a) => a.status === 'Escalated').length,
              Closed: alerts.filter((a) => a.status === 'Closed').length
            }
            return Object.entries(map).map(([name, value]) => ({ name, value }))
          },

          riskHeatmap: () => {
            const compliance = get().selectors.compliance()
            const byDomain: Record<string, number[]> = {}
            for (const c of compliance) {
              byDomain[c.domain] ||= []
              byDomain[c.domain].push(100 - c.coveragePct)
            }
            return Object.entries(byDomain).map(([domain, risks]) => ({
              domain,
              risk: Math.round(risks.reduce((a, b) => a + b, 0) / risks.length)
            }))
          }
        }
      }
    },
    { name: 'aegisx-store-v1', partialize: (s) => ({ session: s.session }) }
  )
)
