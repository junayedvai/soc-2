from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.models import AuditEvent


def audit_event(tenant_id: str, actor: str, action: str, meta: dict[str, Any] | None = None) -> AuditEvent:
    return AuditEvent(
        id=f"AU-{tenant_id}-{int(datetime.now().timestamp())}",
        tenantId=tenant_id,
        ts=datetime.now(timezone.utc).isoformat(),
        actor=actor,
        action=action,
        meta=meta or {},
    )
