from __future__ import annotations

from typing import Any, Literal, Optional
from pydantic import BaseModel, Field

Severity = Literal["Critical", "High", "Medium", "Low"]


class Alert(BaseModel):
    id: str
    tenantId: str
    title: str
    source: Literal["Auth", "EDR", "NDR", "Cloud", "WAF"]
    severity: Severity
    status: Literal["New", "Acknowledged", "Assigned", "Escalated", "Closed"] = "New"
    ip: Optional[str] = None
    user: Optional[str] = None
    rawLog: str
    aiSummary: str
    enrichment: dict[str, str] = Field(default_factory=dict)


class IncidentAction(BaseModel):
    ts: str
    actor: str
    type: Literal["BlockIP", "DisableUser", "QuarantineHost", "Note", "StageChange"]
    detail: str
    success: bool = True


class Incident(BaseModel):
    id: str
    tenantId: str
    title: str
    severity: Severity
    status: Literal["Open", "Containment", "Recovery", "Closed"] = "Open"
    playbookStage: Literal["Detect", "Enrich", "Contain", "Recover", "Close"] = "Detect"
    relatedAlertIds: list[str] = Field(default_factory=list)
    actions: list[IncidentAction] = Field(default_factory=list)
    aiSummary: str = ""


class EvidenceItem(BaseModel):
    id: str
    title: str
    status: Literal["Missing", "In Review", "Accepted"]


class ComplianceControl(BaseModel):
    id: str
    tenantId: str
    framework: Literal["Basel III", "IFRS 9", "ESG"]
    domain: str
    control: str
    coveragePct: int
    evidence: list[EvidenceItem] = Field(default_factory=list)
    lastAuditEvent: str


class LogParseRequest(BaseModel):
    tenantId: str
    raw: str


class ParsedEvent(BaseModel):
    ts: str
    category: str
    severity: Severity
    message: str
    user: Optional[str] = None
    ip: Optional[str] = None


class LogParseResponse(BaseModel):
    events: list[ParsedEvent]
    ai_explanation: str


class GenerateAlertRequest(BaseModel):
    tenantId: str
    raw: str


class GenerateAlertResponse(BaseModel):
    alert: Alert


class AuditEvent(BaseModel):
    id: str
    tenantId: str
    ts: str
    actor: str
    action: str
    meta: dict[str, Any] = Field(default_factory=dict)
