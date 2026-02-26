from fastapi import APIRouter
from pydantic import BaseModel

from app.models import Incident
from app.services.audit import audit_event
from app.store import STORE

router = APIRouter()


class CreateIncidentRequest(BaseModel):
    tenantId: str
    alertId: str
    title: str
    severity: str


@router.get("/{tenant_id}", response_model=list[Incident])
def list_incidents(tenant_id: str):
    return STORE.t(tenant_id).incidents


@router.post("/create", response_model=Incident)
def create_incident(req: CreateIncidentRequest):
    # Keep simple: create minimal incident from fields
    inc = Incident(
        id=f"IN-{req.tenantId}-{len(STORE.t(req.tenantId).incidents)+2000}",
        tenantId=req.tenantId,
        title=f"Case: {req.title}",
        severity=req.severity,  # type: ignore
        relatedAlertIds=[req.alertId],
        playbookStage="Detect",
        aiSummary="Incident created from alert. Recommended to run Enrich stage.",
    )
    t = STORE.t(req.tenantId)
    t.incidents.insert(0, inc)
    t.audit.insert(0, audit_event(req.tenantId, actor="system", action="incident.create", meta={"incidentId": inc.id}))
    return inc
