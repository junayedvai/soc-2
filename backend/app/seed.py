from __future__ import annotations

from app.models import ComplianceControl, EvidenceItem
from app.store import STORE

TENANTS = ["tenant-bfsi-01", "tenant-bfsi-02", "tenant-msm-01"]


def seed():
    for tid in TENANTS:
        t = STORE.t(tid)
        if t.compliance:
            continue
        t.compliance = [
            ComplianceControl(
                id=f"CC-{tid}-B3-01",
                tenantId=tid,
                framework="Basel III",
                domain="Operational Risk",
                control="SOC alert triage and escalation within SLA",
                coveragePct=82,
                evidence=[
                    EvidenceItem(id="E-1", title="SLA policy document", status="Accepted"),
                    EvidenceItem(id="E-2", title="Monthly SOC metrics report", status="In Review"),
                    EvidenceItem(id="E-3", title="Incident response runbook", status="Accepted"),
                ],
                lastAuditEvent="Triage workflow updated to include SOAR playbook telemetry.",
            ),
            ComplianceControl(
                id=f"CC-{tid}-IFRS-02",
                tenantId=tid,
                framework="IFRS 9",
                domain="Model Risk",
                control="Access controls and logging for risk models",
                coveragePct=74,
                evidence=[
                    EvidenceItem(id="E-4", title="Model access review", status="Missing"),
                    EvidenceItem(id="E-5", title="Audit log export", status="In Review"),
                ],
                lastAuditEvent="Pending export validation for the quarter.",
            ),
            ComplianceControl(
                id=f"CC-{tid}-ESG-03",
                tenantId=tid,
                framework="ESG",
                domain="Governance",
                control="Third-party risk monitoring and reporting",
                coveragePct=68,
                evidence=[
                    EvidenceItem(id="E-6", title="Vendor inventory", status="Accepted"),
                    EvidenceItem(id="E-7", title="Risk assessment records", status="Missing"),
                ],
                lastAuditEvent="New vendor onboarding questionnaire added.",
            ),
        ]
