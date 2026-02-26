from fastapi import APIRouter

from app.models import GenerateAlertRequest, GenerateAlertResponse
from app.services.alerts import generate_alert
from app.services.audit import audit_event
from app.store import STORE

router = APIRouter()


@router.post("/generate", response_model=GenerateAlertResponse)
def generate(req: GenerateAlertRequest):
    alert = generate_alert(req)
    t = STORE.t(req.tenantId)
    t.alerts.insert(0, alert)
    t.audit.insert(0, audit_event(req.tenantId, actor="ai_engine", action="alert.generate", meta={"alertId": alert.id}))
    return GenerateAlertResponse(alert=alert)
