export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type Role = 'SOC_ANALYST' | 'CISO' | 'EXECUTIVE'

export type Tenant = {
  id: string
  name: string
}

export type Alert = {
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
  title: string
  source: 'Auth' | 'EDR' | 'NDR' | 'Cloud' | 'WAF'
  severity: Severity
  status: 'New' | 'Acknowledged' | 'Assigned' | 'Escalated' | 'Closed'
  assignee?: string
  ip?: string
  user?: string
  mitre?: { tactic: string; technique: string; id: string }[]
  enrichment?: Record<string, string>
  timeline: { ts: string; message: string }[]
  rawLog: string
  aiSummary?: string
}

export type Incident = {
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
  title: string
  status: 'Open' | 'Containment' | 'Recovery' | 'Closed'
  severity: Severity
  relatedAlertIds: string[]
  playbookStage: 'Detect' | 'Enrich' | 'Contain' | 'Recover' | 'Close'
  actions: {
    ts: string
    actor: string
    type: 'BlockIP' | 'DisableUser' | 'QuarantineHost' | 'Note' | 'StageChange'
    detail: string
    success: boolean
  }[]
  aiSummary?: string
}

export type ComplianceFramework = 'Basel III' | 'IFRS 9' | 'ESG'

export type ComplianceControl = {
  id: string
  tenantId: string
  framework: ComplianceFramework
  domain: string
  control: string
  coveragePct: number
  evidence: { id: string; title: string; status: 'Missing' | 'In Review' | 'Accepted' }[]
  lastAuditEvent: string
}

export type CommandNote = {
  id: string
  tenantId: string
  timestamp: string
  title: string
  body: string
}
