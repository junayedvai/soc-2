from fastapi import APIRouter

from app.models import AuditEvent
from app.store import STORE

router = APIRouter()


@router.get("/{tenant_id}", response_model=list[AuditEvent])
def list_audit(tenant_id: str):
    return STORE.t(tenant_id).audit[:200]
