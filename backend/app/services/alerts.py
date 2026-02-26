from __future__ import annotations

from datetime import datetime, timezone

from app.models import Alert, GenerateAlertRequest
from app.services.ai_engine import parse_logs, ai_explain


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def generate_alert(req: GenerateAlertRequest) -> Alert:
    events = parse_logs(req.raw)
    explanation = ai_explain(events)

    # default alert
    severity = "Low"
    user = None
    ip = None
    source = "Auth"

    sev_rank = {"Low": 0, "Medium": 1, "High": 2, "Critical": 3}
    if events:
        max_e = max(events, key=lambda e: sev_rank[e.severity])
        severity = max_e.severity
        user = max_e.user
        ip = max_e.ip

    title = (
        "AI-generated: Privileged brute force + suspicious success"
        if severity in ("High", "Critical")
        else "AI-generated: Suspicious activity"
    )

    return Alert(
        id=f"AL-{req.tenantId}-{int(datetime.now().timestamp())}",
        tenantId=req.tenantId,
        title=title,
        source=source,
        severity=severity,
        status="New",
        user=user,
        ip=ip,
        rawLog=req.raw[:5000],
        aiSummary=explanation,
        enrichment={
            "model": "mock-llm",
            "tenant": req.tenantId,
            "confidence": "0.74" if severity in ("High", "Critical") else "0.55",
        },
    )
