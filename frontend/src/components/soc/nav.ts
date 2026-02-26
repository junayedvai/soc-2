import type { Role } from '@/types/domain'
import {
  LayoutDashboard,
  Briefcase,
  ShieldCheck,
  Crosshair,
  Globe2,
  Skull,
  UserX,
  Network,
  Boxes,
  Search,
  ListChecks,
  Workflow,
  Scale,
  Target,
  FolderKanban,
  FileText,
  Settings
} from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: any
  roles: Role[]
}

export const NAV: NavItem[] = [
  { label: 'Unified Dashboard', href: '/', icon: LayoutDashboard, roles: ['SOC_ANALYST', 'CISO', 'EXECUTIVE'] },
  { label: 'CXO-as-a-Service', href: '/executive', icon: Briefcase, roles: ['CISO', 'EXECUTIVE'] },
  { label: 'CISO Command', href: '/compliance', icon: ShieldCheck, roles: ['CISO'] },
  { label: 'SOC Analyst War Room', href: '/alerts', icon: Crosshair, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Global Threat Landscape', href: '/threat-landscape', icon: Globe2, roles: ['SOC_ANALYST', 'CISO', 'EXECUTIVE'] },
  { label: 'Dark Web Intelligence', href: '/threat-landscape', icon: Skull, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Human Risk', href: '/executive', icon: UserX, roles: ['CISO', 'EXECUTIVE'] },
  { label: 'Network Detection & Response', href: '/alerts', icon: Network, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Asset Inventory', href: '/settings', icon: Boxes, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Query Builder', href: '/ai-log-analysis', icon: Search, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Rules Management', href: '/alerts', icon: ListChecks, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'SOAR Playbooks', href: '/incidents', icon: Workflow, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Audit & Compliance', href: '/compliance', icon: Scale, roles: ['CISO'] },
  { label: 'MITRE ATT&CK', href: '/alerts', icon: Target, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Case Management', href: '/incidents', icon: FolderKanban, roles: ['SOC_ANALYST', 'CISO'] },
  { label: 'Executive Reports', href: '/executive', icon: FileText, roles: ['CISO', 'EXECUTIVE'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['SOC_ANALYST', 'CISO', 'EXECUTIVE'] }
]
