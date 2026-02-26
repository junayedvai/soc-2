from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

from app.models import Alert, Incident, ComplianceControl, AuditEvent


@dataclass
class TenantStore:
    alerts: List[Alert] = field(default_factory=list)
    incidents: List[Incident] = field(default_factory=list)
    compliance: List[ComplianceControl] = field(default_factory=list)
    audit: List[AuditEvent] = field(default_factory=list)


class InMemoryStore:
    def __init__(self):
        self.tenants: Dict[str, TenantStore] = {}

    def t(self, tenant_id: str) -> TenantStore:
        if tenant_id not in self.tenants:
            self.tenants[tenant_id] = TenantStore()
        return self.tenants[tenant_id]


STORE = InMemoryStore()
