from fastapi import APIRouter
from pydantic import BaseModel

from app.models import ComplianceControl
from app.services.compliance import ai_risk_narrative
from app.store import STORE

router = APIRouter()


class ComplianceSummary(BaseModel):
    tenantId: str
    coveragePct: int
    narrative: str


@router.get("/{tenant_id}/controls", response_model=list[ComplianceControl])
def list_controls(tenant_id: str):
    return STORE.t(tenant_id).compliance


@router.get("/{tenant_id}/summary", response_model=ComplianceSummary)
def summary(tenant_id: str):
    controls = STORE.t(tenant_id).compliance
    coverage = round(sum(c.coveragePct for c in controls) / len(controls)) if controls else 0
    return ComplianceSummary(tenantId=tenant_id, coveragePct=coverage, narrative=ai_risk_narrative(controls))
