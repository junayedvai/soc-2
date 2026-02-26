from __future__ import annotations

from app.models import ComplianceControl


def ai_risk_narrative(controls: list[ComplianceControl]) -> str:
    if not controls:
        return "No compliance controls are configured for this tenant."

    avg = round(sum(c.coveragePct for c in controls) / len(controls))
    missing = sum(1 for c in controls for e in c.evidence if e.status == "Missing")

    if avg >= 80 and missing == 0:
        return "Controls show strong coverage with accepted evidence. Maintain cadence and automate exports for audit readiness."

    return (
        f"Average coverage is {avg}%. Missing evidence items: {missing}. "
        "Priority: close evidence gaps, link SOAR telemetry to control validation, and ensure quarterly sign-offs."
    )
