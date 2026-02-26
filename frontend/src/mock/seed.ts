import type { Alert, ComplianceControl, CommandNote, Incident, Tenant } from '@/types/domain'

export const tenants: Tenant[] = [
  { id: 'tenant-bfsi-01', name: 'BFSI Alpha Bank' },
  { id: 'tenant-bfsi-02', name: 'BFSI Meridian Capital' },
  { id: 'tenant-msm-01', name: 'MSM Retail Group' }
]

function baseAlert(tenantId: string, idx: number, partial: Partial<Alert>): Alert {
  const now = Date.now()
  const createdAt = new Date(now - idx * 1000 * 60 * 7).toISOString()
  const a: Alert = {
    id: `AL-${tenantId}-${1000 + idx}`,
    tenantId,
    createdAt,
    updatedAt: createdAt,
    title: partial.title ?? 'Suspicious activity detected',
    source: partial.source ?? 'Auth',
    severity: partial.severity ?? 'Medium',
    status: partial.status ?? 'New',
    assignee: partial.assignee,
    ip: partial.ip,
    user: partial.user,
    timeline: [
      { ts: createdAt, message: 'Alert generated from log pipeline.' },
      { ts: new Date(now - (idx - 1) * 1000 * 60 * 6).toISOString(), message: 'Enrichment completed.' }
    ],
    rawLog:
      partial.rawLog ??
      'Feb 26 09:12:32 authd[8123]: Failed password for admin from 185.199.110.153 port 53211 ssh2',
    mitre:
      partial.mitre ??
      [
        { tactic: 'Credential Access', technique: 'Brute Force', id: 'T1110' },
        { tactic: 'Initial Access', technique: 'Valid Accounts', id: 'T1078' }
      ],
    enrichment:
      partial.enrichment ??
      {
        geo: 'Unknown (VPN/Proxy suspected)',
        reputation: 'Likely malicious',
        asset: 'linux-bastion-02'
      },
    aiSummary:
      partial.aiSummary ??
      'Multiple signals indicate suspicious behavior. Recommended containment and analyst validation.'
  }
  return a
}

export function seedAlerts(tenantId: string): Alert[] {
  return [
    baseAlert(tenantId, 0, {
      title: 'Privileged account brute force detected',
      severity: 'Critical',
      ip: '185.199.110.153',
      user: 'admin',
      aiSummary:
        'Multiple failed login attempts against a privileged account from an IP with poor reputation. Recommend rate-limiting, IP blocking, and verifying MFA posture.'
    }),
    baseAlert(tenantId, 1, {
      title: 'Suspicious IP login attempt',
      severity: 'High',
      ip: '45.141.87.22',
      user: 'svc-backup'
    }),
    baseAlert(tenantId, 2, {
      title: 'Impossible travel authentication',
      severity: 'Medium',
      ip: '103.21.244.0',
      user: 'j.smith',
      enrichment: { geo: 'Dhaka → Frankfurt (8 min)', reputation: 'Unknown', asset: 'o365' },
      mitre: [{ tactic: 'Defense Evasion', technique: 'Valid Accounts', id: 'T1078' }]
    }),
    baseAlert(tenantId, 3, {
      title: 'WAF SQLi probe',
      severity: 'High',
      source: 'WAF',
      ip: '91.240.118.172',
      rawLog: 'waf: SQLi pattern detected on /login?u=admin\' OR 1=1 --'
    }),
    baseAlert(tenantId, 4, {
      title: 'Endpoint suspicious PowerShell',
      severity: 'Critical',
      source: 'EDR',
      user: 'finance-app',
      rawLog: 'edr: powershell -enc JABXAG8A... (obfuscated)'
    }),
    baseAlert(tenantId, 5, {
      title: 'NDR lateral movement signal',
      severity: 'High',
      source: 'NDR',
      ip: '10.10.14.22',
      rawLog: 'ndr: SMB session spike between host-a and host-b'
    }),
    baseAlert(tenantId, 6, {
      title: 'Cloud IAM policy anomaly',
      severity: 'Medium',
      source: 'Cloud',
      user: 'ops-admin',
      rawLog: 'cloudtrail: PutRolePolicy attached wildcard permissions'
    }),
    baseAlert(tenantId, 7, {
      title: 'Repeated login failures',
      severity: 'Low',
      ip: '203.0.113.9',
      user: 'guest'
    })
  ]
}

export function seedIncidents(tenantId: string): Incident[] {
  const now = Date.now()
  const createdAt = new Date(now - 1000 * 60 * 42).toISOString()
  return [
    {
      id: `IN-${tenantId}-2001`,
      tenantId,
      createdAt,
      updatedAt: createdAt,
      title: 'Privileged account brute force campaign',
      status: 'Open',
      severity: 'Critical',
      relatedAlertIds: [`AL-${tenantId}-1000`, `AL-${tenantId}-1001`],
      playbookStage: 'Detect',
      actions: [
        {
          ts: createdAt,
          actor: 'system',
          type: 'Note',
          detail: 'Incident auto-created from correlated auth alerts.',
          success: true
        }
      ],
      aiSummary:
        'Indicators suggest an external brute-force campaign targeting privileged identities. Recommend immediate containment via IP block and forced credential reset, followed by investigation of lateral movement.'
    }
  ]
}

export function seedCompliance(tenantId: string): ComplianceControl[] {
  return [
    {
      id: `CC-${tenantId}-B3-01`,
      tenantId,
      framework: 'Basel III',
      domain: 'Operational Risk',
      control: 'SOC alert triage and escalation within SLA',
      coveragePct: 82,
      evidence: [
        { id: 'E-1', title: 'SLA policy document', status: 'Accepted' },
        { id: 'E-2', title: 'Monthly SOC metrics report', status: 'In Review' },
        { id: 'E-3', title: 'Incident response runbook', status: 'Accepted' }
      ],
      lastAuditEvent: 'Triage workflow updated to include SOAR playbook telemetry.'
    },
    {
      id: `CC-${tenantId}-IFRS-02`,
      tenantId,
      framework: 'IFRS 9',
      domain: 'Model Risk',
      control: 'Access controls and logging for risk models',
      coveragePct: 74,
      evidence: [
        { id: 'E-4', title: 'Model access review', status: 'Missing' },
        { id: 'E-5', title: 'Audit log export', status: 'In Review' }
      ],
      lastAuditEvent: 'Pending export validation for the quarter.'
    },
    {
      id: `CC-${tenantId}-ESG-03`,
      tenantId,
      framework: 'ESG',
      domain: 'Governance',
      control: 'Third-party risk monitoring and reporting',
      coveragePct: 68,
      evidence: [
        { id: 'E-6', title: 'Vendor inventory', status: 'Accepted' },
        { id: 'E-7', title: 'Risk assessment records', status: 'Missing' }
      ],
      lastAuditEvent: 'New vendor onboarding questionnaire added.'
    }
  ]
}

export function seedNotes(tenantId: string): CommandNote[] {
  return [
    {
      id: `CN-${tenantId}-1`,
      tenantId,
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString(),
      title: 'AI triage assistant',
      body: 'Recommended escalating two auth alerts due to repeated failures on privileged accounts and poor IP reputation.'
    },
    {
      id: `CN-${tenantId}-2`,
      tenantId,
      timestamp: new Date(Date.now() - 1000 * 60 * 16).toLocaleTimeString(),
      title: 'SOAR telemetry',
      body: 'Containment stage executed: simulated IP block and user lockout actions are available in the playbook panel.'
    },
    {
      id: `CN-${tenantId}-3`,
      tenantId,
      timestamp: new Date(Date.now() - 1000 * 60 * 28).toLocaleTimeString(),
      title: 'Compliance signal',
      body: 'IFRS 9 evidence checklist shows gaps in model access reviews. Consider scheduling quarterly exports and signoff.'
    }
  ]
}
