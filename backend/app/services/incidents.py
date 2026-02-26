from __future__ import annotations

from datetime import datetime, timezone

from app.models import Incident, IncidentAction, Severity


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_incident_from_alert(tenant_id: str, alert_id: str, title: str, severity: Severity) -> Incident:
    return Incident(
        id=f"IN-{tenant_id}-{int(datetime.now().timestamp())}",
        tenantId=tenant_id,
        title=f"Case: {title}",
        severity=severity,
        relatedAlertIds=[alert_id],
        playbookStage="Detect",
        actions=[
            IncidentAction(
                ts=_now(),
                actor="system",
                type="Note",
                detail=f"Incident created from alert {alert_id}.",
                success=True,
            )
        ],
        aiSummary="Case created. Recommended next step: run Enrich stage to gather IOC reputation and user/device context.",
    )
